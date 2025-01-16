from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db,User, Portfolio, Stock, PortfolioStocks
from datetime import datetime
# from app.models.portfolio import update_total_value
# import logging
# import yfinance as yf
# from ...app import refresh_stock_prices
import requests
from flask import jsonify

stock_routes = Blueprint('stock', __name__)

POLYGON_API_KEY = 'LpNpfpZoN2hC7gx6ofNrv1nCiSEYkfDz'

@stock_routes.route('/', methods=['GET'])
def get_all_stocks():
    """
    Get all stocks
    """
    stocks = Stock.query.all()

    data = []
    for stock in stocks:
        stock_data = {
            'name': stock.name,
            'open_price': stock.open_price,
            'high_price': stock.high_price,
            'low_price': stock.low_price,
            'volume': stock.volume,
            'close_price': stock.close_price,  
            'volume_weighted_avg_price': stock.volume_weighted_avg_price, 
            # 'last_updated': stock.last_updated 
        }
        data.append(stock_data)

    return jsonify(data),200


@stock_routes.route('/<string:stock_ticker>', methods=['GET'])
def get_stock_info(stock_ticker):
    """
    Get stock info based on stock ticker NOT NAME
    """
    stock = Stock.query.filter_by(name=stock_ticker.upper()).first()

    if stock:
        stock_data = {
            'name': stock.name,
            'open_price': stock.open_price,
            'high_price': stock.high_price,
            'low_price': stock.low_price,
            'volume': stock.volume,
            'close_price': stock.close_price, 
            'volume_weighted_avg_price': stock.volume_weighted_avg_price,  
            'last_updated': stock.last_updated 
        }
        return jsonify(stock_data), 200

    else:
        response = requests.get(
            f"https://api.polygon.io/v2/aggs/ticker/{stock_ticker}/prev?adjusted=true&apiKey={POLYGON_API_KEY}"
        )

        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])[0]

            open_price = results.get('o')
            high_price = results.get('h')
            low_price = results.get('l')
            volume = results.get('v')

            if open_price and high_price and low_price and volume:
                stock_data = {
                    'name': stock_ticker.upper(),
                    'open_price': open_price,
                    'high_price': high_price,
                    'low_price': low_price,
                    'volume': volume,
                    'close_price': results.get('c'), 
                    'volume_weighted_avg_price': results.get('vw')  
                }
            return jsonify(stock_data), 200
        else:
            return jsonify({"error": "Data for this stock could not be found"}), 404


@stock_routes.route('/buy/<string:stock_ticker>/<int:portfolio_id>', methods=['POST'])
@login_required
def purchase_stock(stock_ticker, portfolio_id):
    
    """
    Buy stock and add to portfolio
    """

    if not current_user.is_authenticated:
        return jsonify({"error": "Authentication required"}), 401
    
    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=current_user.id).first()
    
    if not portfolio:
        return jsonify({"error": "Portfolio not found for user"}), 404

    response = requests.get(f"https://api.polygon.io/v2/aggs/ticker/{stock_ticker}/prev?adjusted=true&apiKey={POLYGON_API_KEY}")
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from Polygon API"}), 500
    
    data = response.json()
    results = data.get('results', [])
    
    if not results:
        return jsonify({"error": "Stock data not available from Polygon"}), 404
    
    stock_data = results[0]
    vwap = float(stock_data.get('vw', 0)) 
    
    if vwap == 0:
        return jsonify({"error": "Incomplete stock data fetched from Polygon"}), 404
    
    name = stock_ticker.upper()
    existing_stock = Stock.query.filter_by(name=name).first()

    if not existing_stock:
        existing_stock = Stock(name=name, volume_weighted_avg_price=vwap)
        db.session.add(existing_stock)
        db.session.commit()


    quantity = request.json.get('quantity')
    if not quantity or quantity <= 0:
        return jsonify({"error": "Please provide a valid quantity"}), 400
    

    total_cost = vwap * quantity


    if portfolio.balance < total_cost:
        return jsonify({"error": "Insufficient balance for this transaction"}), 400
    

    portfolio.balance -= total_cost
    db.session.commit()


    portfolio_stock = PortfolioStocks.query.filter_by(portfolio_id=portfolio.id, stock_id=existing_stock.id).first()

    if portfolio_stock:
        portfolio_stock.quantity += quantity
    else:
        portfolio_stock = PortfolioStocks(portfolio_id=portfolio.id, stock_id=existing_stock.id, quantity=quantity)
        db.session.add(portfolio_stock)


    portfolio.update_total_value()
    db.session.commit()

    return jsonify({
        "message": "Stock purchased successfully!",
        "name": name,
        "quantity": quantity,
        "total_cost": total_cost,
        "balance": portfolio.balance,
        "portfolio_total_value": portfolio.total_value
    }), 200

@stock_routes.route('/sell/<string:stock_ticker>/<int:portfolio_id>', methods=['DELETE'])
@login_required
def sell_stock(stock_ticker, portfolio_id):
    
    """
    Sell stock and add to portfolio
    """
    if not current_user.is_authenticated:
        return jsonify({"error": "Authentication required"}), 401
    
    portfolio = Portfolio.query.filter_by(id= portfolio_id, user_id=current_user.id).first()
    
    if not portfolio:
        return jsonify({"error": "Portfolio not found for user"}), 404

    stock = yf.Ticker(stock_ticker)
    data = stock.info
    price = data.get('currentPrice')
    name = data.get('longName')
    industry = data.get('industry')
    description = data.get('longBusinessSummary')

    existing_stock = Stock.query.filter_by(name=name).first()  
    if not existing_stock:
        new_stock = Stock(name=name, price=price, industry=industry, description=description)
        db.session.add(new_stock)
        db.session.commit()
        existing_stock = new_stock

    quantity = request.json.get('quantity')
    if not quantity:
        return jsonify({"error", "Please provide quantity"}), 404
    
    stock_in_portfolio = PortfolioStocks.query.filter_by(portfolio_id=portfolio.id, stock_id=existing_stock.id).first()
    if not stock_in_portfolio or stock_in_portfolio.quantity < quantity:
        return jsonify({"error": "Sell error, either stock isnt in portfolio or quanity exceeded"}), 400
    
    sell_cost = price * quantity
    portfolio.balance += sell_cost
    stock_in_portfolio.quantity -= quantity

    if stock_in_portfolio.quantity ==0:
        db.session.delete(stock_in_portfolio)

    db.session.commit()

    portfolio.update_total_value()
    db.session.commit()

    return jsonify({"message": "Stock sold!",
                    "name": name,
                    "quantity": quantity,
                    "total_cost": sell_cost,
                    "portfolio_balance": portfolio.balance,
                    "portfolio_total_value": portfolio.total_value
                    # "portfolio": portfolio.to_dict()}
                    })
