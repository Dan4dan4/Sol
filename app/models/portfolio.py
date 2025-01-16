from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .stock import Stock
import yfinance as yf


class Portfolio(db.Model):
    __tablename__ = 'portfolio'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    balance = db.Column(db.Integer, nullable= True, default= 0)
    total_value = db.Column(db.Integer, nullable= True)

    # portfolio_stocks = db.relationship("PortfolioStocks", back_populates="portfolio", cascade='all, delete-orphan')
    user = relationship("User", back_populates="portfolio")
    stocks = db.relationship('Stock', back_populates='portfolio', cascade='all, delete-orphan')

    def get_total_value(self):
        total = 0
        for stock in self.stocks:
            total += stock.quantity * stock.price 
        return total

    def update_total_value(self):
        total_value = 0
        for stock in self.stocks:
            total_value += stock.quantity * stock.price  
        self.total_value = total_value
        db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'balance': self.balance,
            'total_value': self.total_value,
            'stocks': [
                {
                    'id': stock.id if stock else None,
                    'name': stock.name if stock else 'Unknown',
                    'price': stock.price if stock else 0,
                    'quantity': stock.quantity if stock else 0
                }
                for stock in self.stocks
            ]
        }
