# from app.models import db, WatchlistStocks, environment, SCHEMA
# from sqlalchemy.sql import text


# def seed_watchlist_stocks():
#     stock_id1= [1,2,3,4,5,6,7,8,9,10]
#     stock_id2= [11,12,13,14,15,16,17,18,19,20]

#     for stock_id in stock_id1:
#         watchlist_stock = WatchlistStocks(
#             watchlist_id=1, 
#             stock_id=stock_id
#         )
#         db.session.add(watchlist_stock)
        

#     for stock_id in stock_id2:
#         watchlist2_stock = WatchlistStocks(
#             watchlist_id=2, 
#             stock_id=stock_id
#         )
#         db.session.add(watchlist2_stock)



#     db.session.commit()

# def undo_watchlist_stocks():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM watchlist_stocks"))

#     db.session.commit()
