from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class PortfolioStocks(db.Model):
    __tablename__ = 'portfolio_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('portfolio.id')), primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id')), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    purchase_price = db.Column(db.Float, nullable=False)
    date_purchased = db.Column(db.DateTime, nullable=False, server_default=func.now())

    portfolio = db.relationship('Portfolio', back_populates='portfolio_stocks')
    stock = db.relationship('Stock', back_populates='portfolio_stocks')

