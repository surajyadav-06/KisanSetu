"""
Flask REST API for KisanSetu AI Demand Forecasting and Farm Recommendation Engine.
Runs on Port 5001.
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from forecaster import train_and_forecast
from recommendations import generate_recommendation, get_all_crop_insights

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "KisanSetu-AI-Service",
        "version": "1.0.0",
        "engine": "Scikit-Learn-Ridge-Polynomial-Forecaster"
    })

@app.route("/api/demand/forecast", methods=["GET", "POST"])
def get_forecast():
    try:
        crop = request.args.get("crop", "Tomato")
        days = int(request.args.get("days", "14"))
        
        forecast_result = train_and_forecast(crop_name=crop, forecast_days=days)
        recommendation_result = generate_recommendation(crop, forecast_result)
        
        response_payload = {
            "success": True,
            "product": forecast_result["crop"],
            "currentDemand": forecast_result["currentDemand"],
            "predictedDemand": forecast_result["predictedDemand"],
            "growthPercentage": forecast_result["growthPercentage"],
            "confidence": forecast_result["confidence"],
            "trend": forecast_result["trend"],
            "recommendation": recommendation_result["recommendation"],
            "action": recommendation_result["action"],
            "actionLabel": recommendation_result["actionLabel"],
            "headline": recommendation_result["headline"],
            "operationalGuidance": recommendation_result["operationalGuidance"],
            "impactEstimate": recommendation_result["impactEstimate"],
            "urgency": recommendation_result["urgency"],
            "chartData": forecast_result["chartData"]
        }
        return jsonify(response_payload)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/demand/insights", methods=["GET"])
def get_all_insights():
    try:
        insights = get_all_crop_insights()
        return jsonify({
            "success": True,
            "data": insights
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"Starting KisanSetu AI Service on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
