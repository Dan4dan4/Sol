from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db,User, Portfolio, Stock, PortfolioStocks
from datetime import datetime

portfolio_routes = Blueprint('portfolio', __name__)


@portfolio_routes.route('/<int:user_id>', methods=['GET'])
@login_required
def get_portfolio(user_id):
    """
    Get portfolio of logged in user
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    portfolios = Portfolio.query.filter_by(user_id=user_id).all()

    if not portfolios:
        return jsonify({"portfolio": []})

    all_portfolios = [portfolio.to_dict() for portfolio in portfolios]
    return jsonify({"portfolios": all_portfolios}), 200


@portfolio_routes.route('/<int:user_id>', methods=['POST'])
@login_required
def create_portfolio(user_id):
    """
    Create a portfolio if logged in
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    # print(request.json)

    balance = request.json.get('balance')

    # if balance is None:
    #     balance = 0

    new_portfolio = Portfolio(user_id = user_id, balance=balance)

    db.session.add(new_portfolio)
    db.session.commit()

    return jsonify({"New portfolio created": new_portfolio.to_dict()}),201