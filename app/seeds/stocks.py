import requests
from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

POLYGON_API_KEY = 'LpNpfpZoN2hC7gx6ofNrv1nCiSEYkfDz'

stock_symbols = [
    'AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOG', 'FB', 'NVDA', 'SPY', 'NFLX', 'BABA',
    'DIS', 'INTC', 'BA', 'V', 'JPM', 'WMT', 'PFE', 'PYPL', 'TSN', 'HD', 
    'UNH', 'GE', 'T', 'AMD', 'GS', 'MS', 'KHC', 'SQ', 'CRM', 'IBM', 'INTC',
    'KO', 'PEP', 'NKE', 'GM', 'F', 'XOM', 'CVX', 'BA', 'CAT', 'MO', 
    'LMT', 'RTX', 'MCD', 'SBUX', 'MSCI', 'WFC', 'GE', 'OXY', 'ADBE', 'PYPL',
    'ABT', 'MDT', 'BMY', 'MRK', 'VZ', 'T', 'COST', 'LULU', 'EL', 'ABNB',
    'CME', 'AMAT', 'ORCL', 'INTU', 'MU', 'TXN', 'AVGO', 'CSCO', 'SNAP', 'TWTR',
    'PLTR', 'SQ', 'SPOT', 'LYFT', 'UBER', 'GOOG', 'MSFT', 'NVDA', 'AMD', 'NVAX',
    'BIDU', 'ASML', 'VLO', 'AIG', 'GM', 'KKR', 'TSM', 'SHOP', 'MELI', 'TTD',
    'PDD', 'FSLY', 'PLUG', 'ENPH', 'DT', 'Z', 'BABA', 'TLRY', 'RBLX', 'ETSY',
    'ROKU', 'AMZN', 'SHOP', 'DOCU', 'SQ', 'TSP', 'AFRM', 'MELI', 'OXY', 'PINS'
]





def get_stock_data_from_polygon(symbol):
    response = requests.get(
        f"https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers={symbol}&apiKey={POLYGON_API_KEY}"
    )
    
    if response.status_code == 200:
        data = response.json()
        tickers = data.get('tickers', [])
        
        if tickers:
            ticker_data = tickers[0]

            day_data = ticker_data.get('day', {})
            
            return {
                "open_price": day_data.get('o'),  
                "high_price": day_data.get('h'),  
                "low_price": day_data.get('l'),   
                "close_price": day_data.get('c'),
                "volume": day_data.get('v'),     
                "volume_weighted_avg_price": day_data.get('vw'),  


            }

    else:
        print(f"Failed to fetch data for {symbol}")
    return None

def seed_stocks():
    for symbol in stock_symbols:
        stock_info = get_stock_data_from_polygon(symbol)
        
        if stock_info:
            name = symbol
            open_price = stock_info.get('open_price', 0.0)
            high_price = stock_info.get('high_price', 0.0)
            low_price = stock_info.get('low_price', 0.0)
            close_price = stock_info.get('close_price', 0.0)
            volume = stock_info.get('volume', 0)
            volume_weighted_avg_price = stock_info.get('volume_weighted_avg_price', 0.0)
        
            existing_stock = Stock.query.filter_by(name=name).first()

            if existing_stock:
                existing_stock.open_price = open_price
                existing_stock.high_price = high_price
                existing_stock.low_price = low_price
                existing_stock.close_price = close_price
                existing_stock.volume = volume
                existing_stock.volume_weighted_avg_price = volume_weighted_avg_price
                existing_stock.last_updated = datetime.utcnow()
                print(f"Updated {name} in the database.")
            else:
                new_stock = Stock(
                    name=name,
                    open_price=open_price,
                    high_price=high_price,
                    low_price=low_price,
                    close_price=close_price,
                    volume=volume,
                    volume_weighted_avg_price=volume_weighted_avg_price,
                    # last_updated=datetime.utcnow()
                )
                db.session.add(new_stock)
                print(f"Added {name} to the database.")

        db.session.commit()
    print("Stocks have been successfully seeded.")



def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))
    
    db.session.commit()
    print("Stocks table has been cleared.")
