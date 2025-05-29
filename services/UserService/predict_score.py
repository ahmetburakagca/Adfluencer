import sys
import joblib
import json

# Komut satırından gelen JSON verisini al
input_data = json.loads(sys.argv[1])

# Girdileri sıraya koy
features = [
    input_data["posts"],
    input_data["followers"],
    input_data["avg_likes"],
    input_data["_60_day_eng_rate"],
    input_data["new_post_avg_like"],
    input_data["total_likes"],
    input_data["avg_likes"] / input_data["followers"]  # engagement_rate
]

# Modeli yükle
model = joblib.load("influencer_score_model.pkl")
prediction = model.predict([features])[0]

print(round(prediction, 2))  # sonucu stdout olarak yaz
print("Gelen veriler:", features, file=sys.stderr)
