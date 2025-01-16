import requests
from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

POLYGON_API_KEY = 'LpNpfpZoN2hC7gx6ofNrv1nCiSEYkfDz'

stock_symbols = [
    'AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOG', 'FB', 'NVDA', 'SPY', 'NFLX', 'BABA', 
    'DIS', 'INTC', 'BA', 'V', 'JPM', 'WMT', 'PFE', 'PYPL', 'TSN', 'HD', 
    'UNH', 'GE', 'T', 'AMD', 'GS', 'MS', 'KHC', 'SQ', 'CRM', 'IBM', 'INTC'
]




def get_stock_data_from_polygon(symbol):
    response = requests.get(
        f"https://api.polygon.io/v2/aggs/ticker/{symbol}/prev?adjusted=true&apiKey={POLYGON_API_KEY}"
    )
    if response.status_code == 200:
        data = response.json()
        results = data.get('results', [])[0] 

        return {
            "open_price": results.get('o'), 
            "high_price": results.get('h'), 
            "low_price": results.get('l'),   
            "volume": results.get('v')      
        }
    else:
        print(f"Failed to fetch data for {symbol}")
        return None


def seed_stocks():
    stock_symbols = [
    'AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOG', 'FB', 'NVDA', 'SPY', 'NFLX', 'BABA', 
    'DIS', 'INTC', 'BA', 'V', 'JPM', 'WMT', 'PFE', 'PYPL', 'TSN', 'HD', 
    'UNH', 'GE', 'T', 'AMD', 'GS', 'MS', 'KHC', 'SQ', 'CRM', 'IBM', 'INTC'
]
  

    for symbol in stock_symbols:
        stock_info = get_stock_data_from_polygon(symbol)
        if stock_info:
            name = symbol
            open_price = stock_info.get('open_price', 0.0)
            high_price = stock_info.get('high_price', 0.0)
            low_price = stock_info.get('low_price', 0.0)
            volume = stock_info.get('volume', 0)

            existing_stock = Stock.query.filter_by(name=name).first()

            if existing_stock:
                existing_stock.open_price = open_price
                existing_stock.high_price = high_price
                existing_stock.low_price = low_price
                existing_stock.volume = volume
                print(f"Updated {name} in the database with open_price {open_price}, "
                      f"high_price {high_price}, low_price {low_price}, and volume {volume}.")
            else:
                new_stock = Stock(
                    name=name,
                    open_price=open_price,
                    high_price=high_price,
                    low_price=low_price,
                    volume=volume
                )
                db.session.add(new_stock)
                print(f"Added {name} to the database with open_price {open_price}, "
                      f"high_price {high_price}, low_price {low_price}, and volume {volume}.")

    db.session.commit()
    print("Stocks have been successfully seeded.")



def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))
    
    db.session.commit()
    print("Stocks table has been cleared.")
