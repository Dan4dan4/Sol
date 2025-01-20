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
    description = db.Column(db.String(255), nullable=True)

    stocks = db.relationship('Stock', back_populates='watchlist')
    user = db.relationship("User", back_populates="watchlists")
    # watchlist_stocks = db.relationship("WatchlistStocks", back_populates="watchlist", cascade='all, delete-orphan')

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
                    # 'price': stock.price,
                    # 'industry': stock.industry
                }
                for stock in self.stocks
            ]
        }
