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
    price = db.Column(Numeric(10, 2), nullable=False)
    industry = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    watchlists = db.relationship('Watchlist',secondary='watchlist_stocks', back_populates = 'stocks')
    portfolios = db.relationship('Portfolio',secondary='portfolio_stocks', back_populates='stocks', overlaps="portfolio_stocks")
    # users = db.relationship("User", back_populates="stocks")
    portfolio_stocks = db.relationship('PortfolioStocks', back_populates='stock')


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'industry': self.industry,
            'description': self.description,
            # "listed_at": self.listed_at
        }
