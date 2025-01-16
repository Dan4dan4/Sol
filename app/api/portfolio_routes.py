from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db,User, Portfolio, Stock
from datetime import datetime
# from app.models.portfolio import update_total_value
import logging

portfolio_routes = Blueprint('portfolio', __name__)


@portfolio_routes.route('/<int:user_id>', methods=['GET'])
@login_required
def get_portfolio(user_id):
    """
    Get all portfolios of logged in user
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    portfolios = Portfolio.query.filter_by(user_id=user_id).all()

    if not portfolios:
        return jsonify({"portfolio": []})

    all_portfolios = [portfolio.to_dict() for portfolio in portfolios]
    return jsonify({"portfolios": all_portfolios}), 200

@portfolio_routes.route('/<int:user_id>/<int:portfolio_id>', methods=['GET'])
@login_required
def get_specific_portfolio(user_id, portfolio_id):
    """
    Get specific portfolio of logged in user
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    portfolio = Portfolio.query.filter_by(user_id=user_id,id= portfolio_id).first()

    if not portfolio:
        return jsonify({"error": "Portfolio not found"})

    return jsonify({"Portfolio": portfolio.to_dict()}), 200


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

    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404

    if balance > user.account_balance:
        return {"error": "Insufficient account balance to create portfolio"}, 400

    user.account_balance -= balance

    new_portfolio = Portfolio(user_id = user_id, balance=balance)

    db.session.add(new_portfolio)
    db.session.commit()

    return jsonify({"New portfolio created": new_portfolio.to_dict()}),201

@portfolio_routes.route('/<int:user_id>/<int:portfolio_id>', methods= ['PUT'])
@login_required
def update_portfolio(user_id, portfolio_id):
    """
    Update a portfolio's balance if logged in 
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403
    
    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id= user_id).first()

    if not portfolio:
        return {"error": "No portfolio found"},404
    
    old_balance = portfolio.balance
    balance = request.json.get('balance', None)
    if balance is not None:
        if balance > current_user.account_balance:
            return {"error": "Insufficient account balance to update portfolio"}, 400
        current_user.account_balance -= ( balance - old_balance)
    elif balance < old_balance:
            current_user.account_balance += (old_balance - balance)
    portfolio.balance = balance

    total_value = portfolio.balance 
    for portfolio_stock in portfolio.portfolio_stocks:
        stock = portfolio_stock.stock
        stock_value = portfolio_stock.quantity * stock.volume_weighted_avg_price
        total_value += stock_value  

    portfolio.total_value = total_value  
    db.session.commit()

    user = User.query.get(user_id)
    user.account_balance += (old_balance - balance)  
    db.session.commit()

    return jsonify({"Updated portfolio": portfolio.to_dict()}), 200


@portfolio_routes.route('/<int:user_id>/<int:portfolio_id>', methods= ['DELETE'])
@login_required
def delete_portfolio(user_id, portfolio_id):
    """
    Delete portfolio
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id= user_id).first()

    if not portfolio:
        return {"error": "No portfolio found"}, 404
    
    total_value = portfolio.balance
    for portfolio_stock in portfolio.portfolio_stocks:  
        stock = portfolio_stock.stock
        stock_value = portfolio_stock.quantity * stock.volume_weighted_avg_price 
        total_value += stock_value

    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404

    user.account_balance += total_value
    db.session.commit()
    db.session.delete(portfolio)
    db.session.commit()

    return jsonify({"message": "Portfolio deleted and funds added to account balance"}), 200