from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
# from .user import User
# from .watchlist import Watchlist 


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    # stock_id = db.Column(db.Integer,db.ForeignKey('stocks.id'), nullable=True)
    description = db.Column(db.String(255), nullable=True)

    stocks = db.relationship('Stock',secondary='watchlist_stocks', back_populates = 'watchlists')
    user = db.relationship("User", back_populates="watchlists")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            "description": self.description,
            'stocks': [
                {
                    'id': stock.id,
                    'name': stock.name,
                    'price': stock.price,
                    'industry': stock.industry
                }
                for stock in self.stocks
            ]
        }
