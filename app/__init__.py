import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .seeds import seed_commands
from .config import Config
# from .portfolio import portfolio_stocks, Portfolio
# from .stock import Stock
# from .watchlist import Watchlist
from .api.portfolio_routes import portfolio_routes
from .api.stock_routes import stock_routes
from .api.watchlist_routes import watchlist_routes
from .api.search_route import search_routes
from .models import db, Stock
import yfinance as yf
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from .seeds.stocks import get_stock_data_from_polygon

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(portfolio_routes, url_prefix='/api/portfolio')
app.register_blueprint(stock_routes, url_prefix='/api/stock')
app.register_blueprint(watchlist_routes, url_prefix='/api/watchlist')
app.register_blueprint(search_routes, url_prefix='/api/')
db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)

def refresh_stock_prices():
    with app.app_context():
        stocks = Stock.query.all()

        for stock in stocks:
            try:
                stock_info = get_stock_data_from_polygon(stock.name)
                if stock_info:
                    stock.open_price = stock_info.get('open_price', 0.0)
                    stock.high_price = stock_info.get('high_price', 0.0)
                    stock.low_price = stock_info.get('low_price', 0.0)
                    stock.close_price = stock_info.get('close_price', 0.0)
                    stock.volume = stock_info.get('volume', 0)
                    stock.volume_weighted_avg_price = stock_info.get('volume_weighted_avg_price', 0.0)

                    # stock.last_updated = datetime.utcnow()

                    db.session.commit()

            except Exception as e:
                print(f"Error fetching data for {stock.name}: {e}")


def start_price_refresh_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(refresh_stock_prices, 'interval', seconds=30,misfire_grace_time=10) 
    #  misfire_grace_time=10
    scheduler.start()

start_price_refresh_scheduler()

# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
