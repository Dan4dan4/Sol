from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db,User, Portfolio, Stock
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
    stock_name = request.args.get('name', None, type=str)
    min_volume = request.args.get('min_volume', None, type=int)
    max_volume = request.args.get('max_volume', None, type=int)

    query = Stock.query

    if stock_name:
        query = query.filter(Stock.name.ilike(f'%{stock_name}%'))
    if min_volume is not None:
        query = query.filter(Stock.volume >= min_volume)
    if max_volume is not None:
        query = query.filter(Stock.volume <= max_volume)

    stocks = query.all()
    if not stocks:
        return jsonify({'message': "No stocks found matching the criteria."}), 404
            
    return jsonify({'message': "Stock ticker couldn't be found."})