from app.models import db, Portfolio, PortfolioStocks, Stock, User, environment, SCHEMA
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

def seed_portfolios():

    portfolio = Portfolio(
        user_id=1
    )


    portfolio_stock1 = PortfolioStocks(
        portfolio_id=1,
        stock_id=1,
        quantity=100,
        purchase_price=250,
        date_purchased=func.now()
    )

    portfolio_stock2 = PortfolioStocks(
        portfolio_id=1,
        stock_id=2,
        quantity=50,
        purchase_price=150,
        date_purchased=func.now()
    )

    db.session.add(portfolio)
    db.session.add(portfolio_stock1)
    db.session.add(portfolio_stock2)
    
    db.session.commit()

def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolio RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM portfolio")

    db.session.commit()

def undo_portfolio_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolio_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM portfolio_stocks")

    db.session.commit()
