from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


# portfolio_stocks = db.Table('portfolio_stocks',
#     db.Column('portfolio_id', db.Integer, db.ForeignKey('portfolio.id'), primary_key=True),
#     db.Column('stock_id', db.Integer, db.ForeignKey('stocks.id'), primary_key=True),
#     db.Column('quantity', db.Integer, nullable=False),
#     db.Column('purchase_price', db.Integer, nullable=False),
#     db.Column('date_purchased', db.DateTime, nullable=False, server_default=func.now())
# )

class Portfolio(db.Model):
    __tablename__ = 'portfolio'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    portfolio_stocks = db.relationship("PortfolioStocks", back_populates="portfolio")
    user = relationship("User", back_populates="portfolio")
    stocks = db.relationship("Stock", secondary='portfolio_stocks', back_populates="portfolios")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'stocks': [
                {
                    'stock_id': stock.id,
                    'quantity': portfolio_stock.quantity,
                    'purchase_price':portfolio_stock.purchase_price,
                    'date_purchased': portfolio_stock.date_purchased,
                    'name': stock.name,
                    'price': stock.price
                } for stock in self.stocks
                for portfolio_stock in stock.portfolio_stocks
            ]
        }
