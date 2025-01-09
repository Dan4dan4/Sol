from app.models import db, WatchlistStocks, environment, SCHEMA
from sqlalchemy.sql import text


def seed_watchlist_stocks():
    WatchlistStock1 = WatchlistStocks(
        watchlist_id=1, 
        # stock_id=1 
    )
    WatchlistStock2 = WatchlistStocks(
        watchlist_id=1, 
        # stock_id=2 
    )



    db.session.add(WatchlistStock1)
    db.session.add(WatchlistStock2)
    db.session.commit()

def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))

    db.session.commit()
