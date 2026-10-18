"""
Сборщик отзывов для oldartcollection.com.

Запускается GitHub Actions каждые 4 часа (.github/workflows/update.yml):
  1. берёт рейтинг и свежие отзывы с Авито через официальный API;
  2. добавляет данные Мешка и Яндекс Карт из настроек ниже;
  3. публикует один файл reviews.json на GitHub Pages:
     https://dinyarik.github.io/oldart-reviews/reviews.json

Ключи Авито — в секретах репозитория AVITO_CLIENT_ID / AVITO_CLIENT_SECRET.
Новые отзывы с Мешка и рейтинг Мешка — менять вручную в блоке MESHOK ниже.
"""
import json
import os
import sys
import time
from datetime import datetime, timezone

import requests

# ---------- Ручные данные (меняются редко) ----------
MESHOK = {
    "name": "Мешок",
    "rating": 5.0,          # API Мешка рейтинг не отдаёт — обновлять вручную
    "count": 182,           # число оценок
    "reviews_total": 282,
    "url": "https://meshok.net/info/1656529",
    "updated_manually": "2026-10-18",
}
# Отобранные отзывы с Мешка (вставить вручную, 5–7 штук)
MESHOK_REVIEWS = [
    # {"name": "Имя", "text": "Текст отзыва", "date": "2026-09-01", "item": "Название лота"},
    {"name": "Jaroslavich", "date": "2026-07-15",
     "text": "Отличный продавец. Хороший предмет за разумные деньги. Быстрая отправка. Хорошая упаковка. Очень доволен, рекомендую продавца!"},
    {"name": "pimial60", "date": "2026-09-17",
     "text": "Быстрая сделка. Лот полностью соответствует описанию. Рекомендую к сотрудничеству."},
    {"name": "stepanov.alexander99", "date": "2026-07-17",
     "text": "Отличный продавец!!! Замечательное общение!!! Прекрасная посылка!!!"},
    {"name": "arhhostel", "date": "2026-10-04",
     "text": "Замечательно. Всем рекомендую и советую)"},
]
YANDEX = {
    "name": "Яндекс Карты",
    "org_id": "111938430078",
    "url": "https://yandex.ru/maps/org/111938430078/reviews/",
    # Живой рейтинг Яндекса показывает его официальный виджет на сайте;
    # число здесь — только запасное значение для строки в карточке товара.
    "rating": 4.8,
    "count": 15,
}

AVITO_PROFILE_URL = os.environ.get(
    "AVITO_PROFILE_URL", "https://www.avito.ru/user/86cce34656e33bfb47f5f81e76324bbd/profile")
MIN_TEXT = 30          # минимальная длина отзыва для показа
MAX_AVITO_REVIEWS = 9  # сколько отзывов Авито класть в файл


def avito_token():
    r = requests.post(
        "https://api.avito.ru/token",
        data={
            "grant_type": "client_credentials",
            "client_id": os.environ["AVITO_CLIENT_ID"],
            "client_secret": os.environ["AVITO_CLIENT_SECRET"],
        },
        timeout=20,
    )
    r.raise_for_status()
    return r.json()["access_token"]


def avito_data():
    h = {"Authorization": "Bearer " + avito_token()}
    info = requests.get("https://api.avito.ru/ratings/v1/info", headers=h, timeout=20)
    info.raise_for_status()
    rating = info.json()["rating"]

    picked, offset = [], 0
    while len(picked) < MAX_AVITO_REVIEWS and offset < 100:
        r = requests.get(
            "https://api.avito.ru/ratings/v1/reviews",
            headers=h, params={"offset": offset, "limit": 20}, timeout=20,
        )
        r.raise_for_status()
        batch = r.json().get("reviews", [])
        if not batch:
            break
        for rv in batch:
            text = (rv.get("text") or "").strip()
            if rv.get("score") == 5 and rv.get("stage") == "done" and len(text) >= MIN_TEXT:
                picked.append({
                    "src": "avito",
                    "name": (rv.get("sender") or {}).get("name", "Покупатель").split()[0],
                    "text": text[:400],
                    "date": datetime.fromtimestamp(rv["createdAt"], timezone.utc).strftime("%Y-%m-%d"),
                    "item": (rv.get("item") or {}).get("title", ""),
                })
                if len(picked) >= MAX_AVITO_REVIEWS:
                    break
        offset += 20
        time.sleep(0.5)

    return {
        "name": "Авито",
        "rating": rating.get("score"),
        "count": rating.get("reviewsWithScoreCount"),
        "reviews_total": rating.get("reviewsCount"),
        "url": AVITO_PROFILE_URL,
    }, picked


def build(previous=None):
    try:
        avito, avito_reviews = avito_data()
    except Exception as e:  # Авито недоступен — оставляем прошлые данные
        print("avito error:", e)
        if not previous:
            raise
        avito = previous["sources"]["avito"]
        avito_reviews = [r for r in previous["reviews"] if r["src"] == "avito"]

    meshok_reviews = [dict(r, src="meshok") for r in MESHOK_REVIEWS]
    # чередуем площадки, чтобы лента не была «одной площадкой»
    reviews = []
    for i in range(max(len(avito_reviews), len(meshok_reviews))):
        if i < len(meshok_reviews):
            reviews.append(meshok_reviews[i])
        if i < len(avito_reviews):
            reviews.append(avito_reviews[i])

    total = (avito.get("reviews_total") or 0) + MESHOK["reviews_total"] + YANDEX["count"]
    return {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "total_reviews": total,
        "sources": {"meshok": MESHOK, "avito": avito, "yandex": YANDEX},
        "reviews": reviews,
    }


def main():
    prev = None
    try:
        prev = json.load(open("public/reviews.json", encoding="utf-8"))
    except Exception:
        pass
    data = build(prev)
    os.makedirs("public", exist_ok=True)
    with open("public/reviews.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"ok, {len(data['reviews'])} reviews, avito {data['sources']['avito']['rating']}")


if __name__ == "__main__":
    if "--dry" in sys.argv:
        print(json.dumps(build(), ensure_ascii=False, indent=2))
    else:
        main()
