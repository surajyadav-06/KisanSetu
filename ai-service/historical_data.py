"""
Historical market demand generator and database for KisanSetu AI forecasting engine.
Provides 90 days of realistic daily aggregated transactional records for key crops
across Western India agro-economic hubs (Nashik, Pune, Mumbai APMC, Ahmednagar, Satara).
"""
import datetime
import random
import numpy as np

def generate_crop_history(crop_name, base_qty, trend_slope, volatility, base_price, days=90):
    np.random.seed(42 + len(crop_name))
    random.seed(42 + len(crop_name))
    today = datetime.date.today()
    start_date = today - datetime.timedelta(days=days)
    
    records = []
    for i in range(days):
        current_date = start_date + datetime.timedelta(days=i)
        day_of_week = current_date.weekday() # 0 = Mon, 6 = Sun
        
        # Weekend / restaurant restocking boost on Fri/Sat/Sun
        weekend_factor = 1.18 if day_of_week in [4, 5, 6] else 0.95
        
        # Trend progression + cyclical wave
        trend = (i * trend_slope)
        cyclical = 0.08 * np.sin(i / 6.0)
        noise = np.random.normal(0, volatility)
        
        # Quantity calculation
        qty = int(max(base_qty * 0.4, base_qty * (1 + trend + cyclical + noise) * weekend_factor))
        
        # Inverted price elasticity with seasonal shift
        price_shift = -0.3 * (qty - base_qty) / base_qty
        price = round(float(max(10.0, base_price * (1 + price_shift + np.random.normal(0, 0.04)))), 1)
        
        records.append({
            "date": current_date.isoformat(),
            "dayIndex": i,
            "crop": crop_name,
            "quantityKg": qty,
            "avgPrice": price,
            "region": "Maharashtra-Western-Belt"
        })
    return records

HISTORICAL_DATA = {
    "Tomato": generate_crop_history("Tomato", base_qty=1850, trend_slope=0.0028, volatility=0.07, base_price=28.0),
    "Onion": generate_crop_history("Onion", base_qty=3200, trend_slope=0.0012, volatility=0.05, base_price=22.0),
    "Potato": generate_crop_history("Potato", base_qty=2800, trend_slope=-0.0005, volatility=0.04, base_price=24.0),
    "Grapes": generate_crop_history("Grapes", base_qty=1200, trend_slope=0.0035, volatility=0.09, base_price=65.0),
    "Banana": generate_crop_history("Banana", base_qty=2400, trend_slope=0.0008, volatility=0.03, base_price=35.0)
}

def get_history(crop_name="Tomato"):
    return HISTORICAL_DATA.get(crop_name, HISTORICAL_DATA["Tomato"])
