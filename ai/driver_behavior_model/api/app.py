from flask import Flask, request, jsonify
from src.pipeline import DriverPipeline
import os

app = Flask(__name__)

# تحميل الـ Pipeline مرة واحدة عند تشغيل السيرفر
MODEL_PATH = os.path.join("models", "driver_model_v2.pkl")
pipeline = DriverPipeline(MODEL_PATH)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # استلام بيانات التسارع والدوران
        acc_list = data.get('acc', [])
        gyro_list = data.get('gyro', [])

        if not acc_list or not gyro_list:
            return jsonify({"error": "Missing data"}), 400

        # تنفيذ التوقعات باستخدام الـ Pipeline الجديد
        score, status = pipeline.predict_score(acc_list, gyro_list)

        return jsonify({
            "score": score,
            "status": status,
            "message": f"Driving is {status}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)