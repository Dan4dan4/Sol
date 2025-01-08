from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db,User, Portfolio, Stock, PortfolioStocks

portfolio_routes = Blueprint('portfolio', __name__)


@portfolio_routes.route('/<int:user_id>', methods=['GET'])
@login_required
def get_portfolio(user_id):
    """
    Get portfolio of loged in user
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    portfolio = Portfolio.query.filter_by(user_id=user_id)

    if not portfolio:
        return jsonify({"portfolio": []})

    return jsonify(portfolio.to_dict()), 200
