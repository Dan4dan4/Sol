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

    portfolio_stocks = db.relationship('PortfolioStocks', back_populates='portfolio')
    user = relationship("User", back_populates="portfolio")
    stocks = db.relationship('Stock', back_populates='portfolio', cascade='all, delete-orphan')

    def get_total_value(self):
        total_value = 0
        for portfolio_stock in self.portfolio_stocks:
            stock = portfolio_stock.stock  
            total_value += float(portfolio_stock.quantity) * float(stock.volume_weighted_avg_price) 
        return total_value

    def update_total_value(self):
        total_value = 0
        for stock in self.stocks:
            total_value += float(stock.quantity * stock.volume_weighted_avg_price) 
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
                    'stock_id': portfolio_stock.stock.id,
                    'stock_name': portfolio_stock.stock.name,
                    'quantity': portfolio_stock.quantity,
                    'volume_weighted_avg_price': float(portfolio_stock.stock.volume_weighted_avg_price) if portfolio_stock.stock.volume_weighted_avg_price else None,
                }
                for portfolio_stock in self.portfolio_stocks
            ]
        }
