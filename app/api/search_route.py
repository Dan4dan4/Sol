from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db,User, Portfolio, Stock, PortfolioStocks
from datetime import datetime
# from app.models.portfolio import update_total_value
import logging

search_routes = Blueprint('search', __name__)

# doesnt work yet 
@search_routes.route('/search/', methods=['GET'])
def search_stock():
    """
    Search a stock
    """
    stock_id = request.args.get('id', None, type=int)
    stock_name = request.args.get('name', None, type=str)

    if not stock_id and not stock_name:
        return jsonify({'message': "Invalid stock name or ticker"}), 400

    if stock_id:
        stock = Stock.query.get(stock_id)
        if stock:
            return jsonify({
                'id': stock.id,
                'stock_name': stock.name,
                'price': stock.price,
                'industry': stock.industry,
                'description': stock.description
            }), 200
        else:
            return jsonify({'message': "Stock ID couldn't be found."}), 404

    if stock_name:

        stock = Stock.query.filter_by(name=stock_name).first()
        if stock:
            return jsonify({
                'id': stock.id,
                'stock_name': stock.name,
                'price': stock.price,
                'industry': stock.industry,
                'description': stock.description
            }), 200
        else:
            return jsonify({'message': "Stock name couldn't be found."})