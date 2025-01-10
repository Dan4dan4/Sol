from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text
import yfinance as yf

stock_symbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'BRK-B', 'UNH', 'V',
    'JNJ', 'WMT', 'HD', 'PYPL', 'MA', 'DIS', 'VZ', 'CSCO', 'PFE', 'KO',
    'PEP', 'INTC', 'NFLX', 'XOM', 'NVDA', 'ADBE', 'MRK', 'INTU', 'T',
    'AVGO', 'CVX', 'MCD', 'BA', 'IBM', 'WBA', 'GS', 'GE', 'CAT', 'CVS',
    'BMY', 'LLY', 'RTX', 'AMGN', 'UPS', 'MMM', 'ABT', 'DE', 'COST', 'ORCL',
    'TXN', 'LOW', 'QCOM', 'ZM', 'SPGI', 'REGN', 'MDT', 'AIG', 'LMT', 'AMT'
    ]
def seed_stocks():
    
    for symbol in stock_symbols:
        # stock_data = yf.Ticker(symbol)
        try:
            stock_data = yf.Ticker(symbol)
            stock_info = stock_data.info

            name = stock_info.get('symbol')
            price = stock_info.get('currentPrice')
            industry = stock_info.get('industry')
            description = stock_info.get('longBusinessSummary')


            if price is None:
                continue  

            new_stock = Stock(
                name=name,
                price=price,
                industry=industry,
                description=description
            )


            db.session.add(new_stock)

        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
        
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))
        
    db.session.commit()