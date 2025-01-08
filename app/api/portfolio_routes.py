from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db,User, Portfolio, Stock, PortfolioStocks
from datetime import datetime

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

    new_portfolio = Portfolio(user_id = user_id, balance=balance)

    db.session.add(new_portfolio)
    db.session.commit()

    return jsonify({"New portfolio created": new_portfolio.to_dict()}),201

@portfolio_routes.route('/<int:user_id>/<int:portfolio_id>', methods= ['PUT'])
@login_required
def update_portfolio(user_id, portfolio_id):
    """
    Update a portfolio's balance and stocks if logged in NOT ADD STOCKS
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id= user_id).first()

    if not portfolio:
        return {"error": "No portfolio found"},404
    
    balance = request.json.get('balance', None)
    if balance is not None:
        portfolio.balance = balance

    stocks = request.json.get('stocks', [])
    for data in stocks:
        stock_id= data.get('stock_id')
        quantity = data.get('quantity')
        purchase_price = data.get('purchase_price')

        if not stock_id or not quantity or not purchase_price:
            return {"error": "Missing required stock data"}, 400

        stock = Stock.query.get(stock_id)
        if not stock:
            return{"error": "Stock not found"},404
    
        portfolio_stock = PortfolioStocks.query.filter_by(portfolio_id=portfolio_id, stock_id=stock_id).first()

        if portfolio_stock:
            portfolio_stock.quantity = quantity
            portfolio_stock.purchase_price = purchase_price
        else:
            return {"error": "This stock is not in this portfolio"}, 400

    db.session.commit()

    return jsonify({"Updated portfolio": portfolio.to_dict()}), 200