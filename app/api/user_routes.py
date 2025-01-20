from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/<int:id>/account_balance', methods=['PUT'])
@login_required
def update_account_balance(id):
    """
    Update the account balance for a specific user by id.
    Only the user themselves or an admin should be able to update the balance.
    """
    if current_user.id != id: 
        return jsonify({'error': 'Unauthorized'}), 403


    data = request.get_json()
    new_balance = data.get('account_balance')

    if new_balance is None:
        return jsonify({'error': 'Account balance is required'}), 400

    try:
        new_balance = int(new_balance)
    except ValueError:
        return jsonify({'error': 'Invalid account balance value'}), 400


    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    user.account_balance = new_balance
    db.session.commit()

    return jsonify(user.to_dict()), 200