from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
# from .portfolio import portfolio_stocks
# from .watchlist import Watchlist 
from sqlalchemy import Numeric


class Stock(db.Model):
    __tablename__ = 'stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, unique=True)
    # price = db.Column(Numeric(10, 2), nullable=False)
    # industry = db.Column(db.String(255), nullable=False)
    # description = db.Column(db.String(255), nullable=True)
    open_price = db.Column(Numeric(10, 2), nullable=True)  
    high_price = db.Column(Numeric(10, 2), nullable=True) 
    low_price = db.Column(Numeric(10, 2), nullable=True)   
    volume = db.Column(db.Integer, nullable=True) 
    close_price = db.Column(Numeric(10, 2), nullable=True)
    volume = db.Column(db.Integer, nullable=True)
    volume_weighted_avg_price = db.Column(Numeric(10, 2), nullable=True)
    # last_updated = db.Column(db.DateTime, default=func.now(), nullable=False)          
    # ask_price = db.Column(Numeric(10, 2), nullable=True)
    # bid_price = db.Column(Numeric(10, 2), nullable=True)
    # ask_size = db.Column(db.Integer, nullable=True)
    # bid_size = db.Column(db.Integer, nullable=True)
    # timestamp = db.Column(db.BigInteger, nullable=True)  



    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('watchlists.id')), nullable=True)
    watchlist = db.relationship('Watchlist', back_populates = 'stocks')

    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('portfolio.id')), nullable=True)
    portfolio = db.relationship('Portfolio', back_populates='stocks')
    # portfolios = db.relationship('Portfolio',secondary='portfolio_stocks', back_populates='stocks', overlaps="portfolio_stocks")
    # users = db.relationship("User", back_populates="stocks")
    # portfolio_stocks = db.relationship('PortfolioStocks', back_populates='stock')
    # watchlist_stocks = db.relationship('WatchlistStocks', back_populates='stock')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'open_price': self.open_price, 
            'high_price': self.high_price,  
            'low_price': self.low_price,   
            'close_price': self.close_price,
            'volume': self.volume,
            'volume_weighted_avg_price': self.volume_weighted_avg_price,
            # 'ask_price': self.ask_price,
            # 'bid_price': self.bid_price,
            # 'ask_size': self.ask_size,
            # 'bid_size': self.bid_size,
            # 'timestamp': self.timestamp 
            # 'price': self.price,
            # 'industry': self.industry,
            # 'description': self.description,
            # "listed_at": self.listed_at
        }
