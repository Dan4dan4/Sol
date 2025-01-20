from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db,User, Portfolio, Stock, Watchlist
from datetime import datetime
# from app.models.portfolio import update_total_value
import logging

watchlist_routes = Blueprint('watchlist', __name__)


@watchlist_routes.route('/<int:user_id>', methods=['GET'])
@login_required
def get_watchlist(user_id):
    """
    Get all watchlists of logged in user
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    watchlist = Watchlist.query.filter_by(user_id=user_id).all()

    if not watchlist:
        return jsonify({"watchlist": []})

    all_watchlist = [watchlist.to_dict() for watchlist in watchlist]
    return jsonify({"watchlist": all_watchlist}), 200

@watchlist_routes.route('/<int:user_id>', methods=['POST'])
@login_required
def create_watchlist(user_id):
    """
    Create a watchlist
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    name = request.json.get('name')
    description = request.json.get('description')

    if not name:
        return {"error": "Please provide a name for watchlist"}, 403

    if not description:
        return {"error": "Please provide a description for watchlist "}
    
    new_watchlist = Watchlist(user_id = user_id, name= name, description = description)

    db.session.add(new_watchlist)
    db.session.commit()

    return jsonify({"New Watchlist created": new_watchlist.to_dict()}),201

@watchlist_routes.route('/<int:user_id>/<int:watchlist_id>', methods=['DELETE'])
@login_required
def delete_watchlist(user_id, watchlist_id):
    """
    Delete a watchlist
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403

    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id= user_id).first()
    watchlist_name = watchlist.name

    if not watchlist:
        return {"error": "No watchlist with specified ID"}, 403

    db.session.delete(watchlist)
    db.session.commit()

    return jsonify({"message":f"Successfuly deleted : {watchlist_name}"}),200


@watchlist_routes.route('/<int:user_id>/<int:watchlist_id>', methods=['POST'])
@login_required
def add_stocks_to_watchlist(user_id, watchlist_id):
    """
    Add stocks to watchlist
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403
    
    data = request.get_json()
    print('Request data:', data)  

    if 'stocks' not in data:
        return {'error': 'No stocks key found in the request'}, 400

    stock_name = data['stocks'][0]['stock_name']
    selected_watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=user_id).first()

    if not selected_watchlist:
        return {'error': 'Watchlist not found for this user'}, 404

    stock = Stock.query.filter_by(name=stock_name).first()

    if not stock:
        return {'error': 'Stock not found'}, 404

    selected_watchlist.stocks.append(stock)
    db.session.commit()

    return {'watchlist': selected_watchlist.to_dict()}, 200
   
@watchlist_routes.route('/<int:user_id>/<int:watchlist_id>', methods=['PUT'])
@login_required
def remove_stocks_from_watchlist(user_id, watchlist_id):
    """
    Remove stocks from watchlist
    """
    if user_id != current_user.id:
        return {"error": "Unauthorized access"}, 403
    
    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=user_id).first()

    if not watchlist:
        return {"error": "No watchlist found"}, 404
    
    data = request.get_json()
    print("Request Data:", data)

    if 'stocks' not in data:
        return {"error": "No stocks key found in the request"}, 400

    stock_name = data['stocks'][0]['stock_name']
    stock = Stock.query.filter_by(name=stock_name).first()

    if not stock:
        return {"error": "Stock not found"}, 404
    
    if stock not in watchlist.stocks:
        return {"error": f"Stock '{stock.name}' is not in this watchlist"}, 400
    
    watchlist.stocks.remove(stock)
    try:
        db.session.commit()
        return jsonify({"message": "Successfully removed stock from watchlist", "watchlist": watchlist.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error removing stock from watchlist: {str(e)}")
        return jsonify({"error": "An error occurred while removing the stock."}), 500