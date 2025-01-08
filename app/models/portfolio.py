from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Portfolio(db.Model):
    __tablename__ = 'portfolio'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    balance = db.Column(db.Integer, nullable= True, default= 0)
    total_value = db.Column(db.Integer, nullable= True, default= 0)

    portfolio_stocks = db.relationship("PortfolioStocks", back_populates="portfolio", overlaps="stocks")
    user = relationship("User", back_populates="portfolio")
    stocks = db.relationship("Stock", secondary='portfolio_stocks', back_populates="portfolios",overlaps="portfolio_stocks")

    def get_total_value(self):
        total = 0
        for portfolio_stock in self.portfolio_stocks:
            stock = portfolio_stock.stock
            total += portfolio_stock.quantity * stock.price
        return total

    def update_total_value(self):
        total_value = 0
        for portfolio_stock in self.portfolio_stocks:
            stock = portfolio_stock.stock
            total_value += portfolio_stock.quantity * stock.price
            print(f"Updating total value for stock {stock.id}: {stock.price} * {portfolio_stock.quantity}")
        self.total_value = total_value
        db.session.commit()  
        print(f"Total value updated: {self.total_value}")



    def to_dict(self):
        self.total_value = self.get_total_value()
        return {
            'id': self.id,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'balance': self.balance,
            'total_value': self.total_value,
            'stocks': [
                {
                    'stock_id': stock.id,
                    'quantity': portfolio_stock.quantity,
                    'purchase_price':portfolio_stock.purchase_price,
                    'date_purchased': portfolio_stock.date_purchased,
                    'name': stock.name,
                    'price': stock.price
                } for portfolio_stock in self.portfolio_stocks
                for stock in [portfolio_stock.stock]
            ]
        }
