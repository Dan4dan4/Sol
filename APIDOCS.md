# `Melody`

## Database Schema Design

[db-schema](./images/DBSchema.png)

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication
* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /api/auth
  * Body: none

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
  {
    "email": "demo@aa.io",
    "first_name": "Demo",
    "id": 1,
    "last_name": "User",
    "watchlist": [],
    "profile_image": "https://m.media-amazon.com/images/M/MV5BNzBmYjBjODktMzE1ZC00NDY1LWJiYzktMWFkM2VjZDVjZTA2XkEyXkFqcGc@._V1_.jpg",
    "username": "Demo"
  }
    ```

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": "null"
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: /api/auth/login
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": "demo@aa.io",
      "password": "password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "email": "demo@aa.io",
    "first_name": "Demo",
    "id": 1,
    "last_name": "User",
    "watchlist": [],
    "profile_image": "https://m.media-amazon.com/images/M/MV5BNzBmYjBjODktMzE1ZC00NDY1LWJiYzktMWFkM2VjZDVjZTA2XkEyXkFqcGc@._V1_.jpg",
    "username": "Demo"
    }
    ```

* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    
      {
    "email": [
        "Email provided not found."
    ],
    "password": [
        "No such user exists."
    ]
    }
    ```

* Error response: Body validation errors
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Unauthorized",
      "errors": {
        "email": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Log out a User
Logs out current User
* Require Authentication: True
* Request
  * Method: POST
  * Route path: /api/auth/logout
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User logged out",
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: /api/auth/signup
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "email": "john.smith@gmail.com",
    "first_name": "John",
    "id": 7,
    "last_name": "Smith",
    "watchlist": [],
    "profile_image": null,
    "username": "JohnSmith"
    }
    
    ```

* Error response: User already exists with the specified email or username
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "errors": {
        "email": [
            "Email address is already in use."
        ],
        "username": [
            "Username is already in use."
        ]
    }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", 
      "errors": {
        "email": "Please provide valid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

## PORTFOLIO

## Get your portfolio

Returns your portfolio if you are signed in


* Require Authentication: true
* Request
  * Method: GET
  * Route path: api/portfolio
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
  "portfolio": [
    {
      "id": 1,
      "stock_id": 2,
      "stock_name": "Apple Inc.",
      "quantity": 50,
      "purchase_price": 150,
      "total_value": 7500,
      "date_purchased": "2023-05-15T08:00:00Z"
    },
    {
      "id": 2,
      "stock_id": 5,
      "stock_name": "Tesla Inc.",
      "quantity": 20,
      "purchase_price": 500,
      "total_value": 10000,
      "date_purchased": "2023-06-10T08:00:00Z"
    }
        ] 
    }
    ```
### Create a portfolio


Create a portfolio if you are signed in 


* Require Authentication: true
* Request
  * Method: POST
  * Route path: api/portfolio
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
  {
  "stock_id": 2,
  "quantity": 50,
  "purchase_price": 150
    }
    ```


* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:


  ```json
    {
  "message": "Portfolio entry created successfully.",
  "portfolio_entry": {
    "id": 1,
    "stock_id": 2,
    "stock_name": "Apple",
    "quantity": 50,
    "purchase_price": 150,
    "total_value": 7500,
    "date_purchased": "2023-05-15T08:00:00Z"
        }
    }

    ```


* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
    "error": "Bad Request",
    "message": "Missing required fields: stock_id, quantity, purchase_price."
    }

  ```

## Update your portfolio

* Require Authentication: true
* Require proper authorization: Portfolio must belong to the current user
* Request
  * Method: PUT
  * Route path: api/portfolio/:portfolio_id
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "stock_id" : 1,
        "quantity": 60,
        "purchase_price": 155
    }

    ```
* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
    "message": "Portfolio entry updated successfully.",
    "portfolio_entry": {
    "id": 1,
    "stock_id": 2,
    "stock_name": "Apple Inc.",
    "quantity": 60,
    "purchase_price": 155,
    "total_value": 9300,
    "date_purchased": "2023-05-15T08:00:00Z"
        }
    }

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
   {
        "error": "Bad Request",
        "message": "Missing required fields: quantity or purchase_price."
    }

    ```
* Error response: Portfolio not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
        "error": "Not Found",
        "message": "Portfolio entry not found."
    }
    ```


# Delete your portfolio

Deletes an existing portfolio.


* Require Authentication: true
* Require proper authorization: true
* Request
  * Method: DELETE
  * Route path: api/portfolio/:portfolio_id
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Portfolio successfully deleted"
    }
    ```


* Error response: Couldn't find a portfolio with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Portfolio couldn't be found"
    }
    ```


* Error response: User not authorized to delete portfolio
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Unauthorized"
    }
    ```

## Stocks

## Get all stocks

Returns all the stocks.


* Require Authentication: false
* Request
  * Method: GET
  * Route path: api/stocks
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
  "stocks": [
    {
      "id": 1,
      "name": "Apple Inc.",
      "price": 150
    },
    {
      "id": 2,
      "name": "Tesla Inc.",
      "price": 500
    },
    {
      "id": 3,
      "name": "Amazon Inc.",
      "price": 300
    }
        ]
    }

    ```
## Get details on a stock

Returns the details of a stock specified by its id.


* Require Authentication: false
* Request
  * Method: GET
  * Route path: api/stocks/:stock_id
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
  "stock": {
    "id": 1,
    "name": "Apple Inc.",
    "price": 150,
    "description": "Apple makes phones",
    "industry": "Technology",
        }
    }

* Error response: Couldn't find a stock with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "error": "Stock couldn't be found"
    }
    ```
## Purchase a stock and add to portfolio

Purchases a stock and adds to portfolio


* Require Authentication: true
* Request
  * Method: POST
  * Route path: api/portfolio/stock
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
        "stock_id": 2,
        "quantity": 20,
        "purchase_price": 500
    }

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:


  ```json
  {
  "message": "Stock purchased and added to portfolio successfully.",
  "portfolio_entry": {
    "id": 1,
    "stock_id": 2,
    "quantity": 20,
    "purchase_price": 500,
    "total_value": 10000,
    "date_purchased": "2023-07-10T08:00:00Z"
        }
    }

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
        "error": "Bad Request",
        "message": "Missing required fields: stock_id, quantity, purchase_price."
    }

* Error Response: Not enough funds
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
        "message": "Not enough funds in account"
    }

### Update a purchase order 


Updates an order and returns portfolio


* Require Authentication: true
* Require proper authorization: true
* Request
  * Method: PUT
  * Route path: api/portfolio/:portfolio_id/stock
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json

    {
        "stock_id": 1,
        "quantity": 30,
        "purchase_price": 510
    }

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
    "message": "Portfolio entry updated successfully.",
    "portfolio_entry": {
    "id": 1,
    "stock_id": 2,
    "stock_name": "Tesla Inc.",
    "quantity": 30,
    "purchase_price": 510,
    "total_value": 15300,
    "date_purchased": "2023-07-10T08:00:00Z"
        }
    }

### Deletes stock order.


* Require Authentication: true
* Require proper authorization: Stock order must belong to the current user
* Request
  * Method: DELETE
  * Route path: api/portfolio/stock_id
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Stock order Successfully deleted"
    }
    ```


* Error response: Couldn't find a Stock order with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
        "messsage": "Stock order successfully deleted"
    }

## Watchlist

## Get all watchlists

Get all watchlists


* Require Authentication: true
* Require proper authorization: false
* Request
  * Method: GET
  * Route path: /api/watchlists


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
     {
        "watchlist": [
        {
        "id": 1,
        "stock_id": 2,
        "stock_name": "Tesla Inc.",
        "price": 500
        },]
    }
    ```


* Error response: Please enter all required fields
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
    "message": "Watchlist not found"
    }
   ```

## Add a stock to watchlist

Adds stock based on watchlist id if user is watchlist owner.


* Require Authentication: false
* Request
  * Method: POST
  * Route path: api/watchlist/:watchlist_id
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
        "stock_id": 8
    }


    ```


    * Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
    "message": "Stock added to watchlist successfully.",
    "watchlist": {
    "id": 3,
    "stock_id": 5,
    "stock_name": "Microsoft Inc.",
    "price": 300
        }
    }

    ```


* Error response: Couldn't find a Watchlist with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Watchlist Not Found"
    }
    ```
### Users should be able to remove stocks from watchlist based on Watchlist Id


Removes stock from watchlist


* Require Authentication: true
* Require proper authorization: true
* Request
  * Method: DELETE
  * Route path: api/watchlist/:watchlist_id/:stock_id
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Successfully deleted stock"
    }
    ```


* Error response: Couldn't find a watchlist with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Watchlist couldn't be found"
    }
    ```
### Users should be able to DELETE watchlists 


Deletes an existing watchlist, based on watchlist id.


* Require Authentication: true
* Require proper authorization: Watchlist must belong to the current user
* Request
  * Method: DELETE
  * Route path: api/watchlist/:watchlist_id
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": " Successfully deleted"
    }
    ```


* Error response: Couldn't find a Watchlist with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Watchlist couldn't be found"
    }
   ```
   
## Search

## Search a stock by name or id

* Require Authentication: false
* Require proper authorization: false
* Request
  * Method: GET
  * Route path: api/stock/search/:stock_id
  * Body: 

  ```json

  {
    "id":2
  }


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "id": 2,
      "stock_name": "Tesla Inc.",
      "price": 500,
      "industry" : "Auto",
      "description" : "makes cars that fly"
    }
    ```


* Error response: Couldn't find a stock with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "stock couldn't be found"
    }
   ```