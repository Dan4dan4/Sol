# from app.models import db, Stock, environment, SCHEMA
# from sqlalchemy.sql import text


# # Adds a demo user, you can add other users here if you want
# def seed_stocks():
#     Apple = Stock(
#         name = "AAPL", price = 250, industry = "Technology", description = "Makes phones")
#     Nvidia = Stock(
#         name = "NVDA", price = 150, industry = "Technology", description = "Makes chips")
#     Meta = Stock(
#         name = "META", price = 450, industry = "Media", description = "Makes social media")


#     db.session.add(Apple)
#     db.session.add(Nvidia)
#     db.session.add(Meta)
#     db.session.commit()


# # Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# # have a built in function to do this. With postgres in production TRUNCATE
# # removes all the data from the table, and RESET IDENTITY resets the auto
# # incrementing primary key, CASCADE deletes any dependent entities.  With
# # sqlite3 in development you need to instead use DELETE to remove all data and
# # it will reset the primary keys for you as well.
# def undo_stocks():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM stocks"))
        
#     db.session.commit()
