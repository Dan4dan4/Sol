from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class WatchlistStocks(db.Model):
    __tablename__ = 'watchlist_stocks'

    watchlist_id = db.Column(db.Integer, db.ForeignKey('watchlists.id'), primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.id'), primary_key=True, nullable =True)
