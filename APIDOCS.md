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
    "account_balance": 13344,
    "created_at": "Mon, 13 Jan 2025 18:18:50 GMT",
    "email": "demo@aa.io",
    "first_name": "Demo",
    "id": 1,
    "last_name": "User",
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

# PORTFOLIO

## Get your portfolios

Returns all portfolios if you are signed in


* Require Authentication: true
* Request
* Method: GET
* Route path: api/portfolio/:user_id
* Body: none


* Successful Response
* Status Code: 200
* Headers:
* Content-Type: application/json
* Body:


    ```json
   {
    "portfolios": [
        {
            "balance": 5000,
            "created_at": "Wed, 08 Jan 2025 21:28:26 GMT",
            "id": 1,
            "stocks": [
                {
                    "date_purchased": "Wed, 08 Jan 2025 21:28:26 GMT",
                    "name": "AAPL",
                    "price": 250,
                    "purchase_price": 250,
                    "quantity": 100,
                    "stock_id": 1
                },
                {
                    "date_purchased": "Wed, 08 Jan 2025 21:28:26 GMT",
                    "name": "NVDA",
                    "price": 150,
                    "purchase_price": 150,
                    "quantity": 50,
                    "stock_id": 2
                }
            ],
            "user_id": 1
        }
    ]
  }
    ```
## Get your portfolio with specific ID

Returns your specific portfolio if you are signed in


* Require Authentication: true
* Request
* Method: GET
* Route path: api/portfolio/:user_id/:portfolio_id
* Body: none


* Successful Response
* Status Code: 200
* Headers:
* Content-Type: application/json
* Body:


    ```json
   {
    "portfolios": {
        "balance": 1500,
        "created_at": "Wed, 08 Jan 2025 22:34:56 GMT",
        "id": 1,
        "stocks": [
            {
                "date_purchased": "Wed, 08 Jan 2025 22:34:56 GMT",
                "name": "AAPL",
                "price": 250,
                "purchase_price": 50,
                "quantity": 100,
                "stock_id": 1
            },
            {
                "date_purchased": "Wed, 08 Jan 2025 22:34:56 GMT",
                "name": "NVDA",
                "price": 150,
                "purchase_price": 100,
                "quantity": 5000,
                "stock_id": 2
            }
        ],
        "user_id": 1
    }
  }
    ```

* Error response: Portfolio not found
* Status Code: 404
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
        "error": "Portfolio not found"
    }
    ```


### Create a portfolio


Create a portfolio if you are signed in 


* Require Authentication: true
* Request
* Method: POST
* Route path: api/portfolio/
* Headers:
* Content-Type: application/json
* Body: 

  ```json

  {"balance" : 25000}


* Successful Response
* Status Code: 201
* Headers:
* Content-Type: application/json
* Body:


  ```json
  {
    "New portfolio created": {
        "balance": 25000,
        "created_at": "Wed, 08 Jan 2025 21:21:58 GMT",
        "id": 3,
        "stocks": [],
        "user_id": 1
    }
  }

    ```

* Successful Response if no balance 
* Status Code: 201
* Headers:
* Content-Type: application/json
* Body:


  ```json
  {
    "New portfolio created": {
        "balance": 0,
        "created_at": "Wed, 08 Jan 2025 21:21:58 GMT",
        "id": 3,
        "stocks": [],
        "user_id": 1
    }
  }

    ```

## Update your portfolio balance

* Require Authentication: true
* Require proper authorization: Portfolio must belong to the current user
* Request
* Method: PUT
* Route path: api/portfolio/:user_id/:portfolio_id
* Headers:
* Content-Type: application/json
* Body:

    ```json
  {
  "balance": 1500
  }

    ```
* Successful Response
* Status Code: 200
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
    "Updated portfolio": {
        "balance": 1500,
        "created_at": "Wed, 08 Jan 2025 22:34:56 GMT",
        "id": 1,
        "stocks": [
            {
                "date_purchased": "Wed, 08 Jan 2025 22:34:56 GMT",
                "name": "AAPL",
                "price": 250,
                "purchase_price": 50,
                "quantity": 100,
                "stock_id": 1
            },
            {
                "date_purchased": "Wed, 08 Jan 2025 22:34:56 GMT",
                "name": "NVDA",
                "price": 150,
                "purchase_price": 100,
                "quantity": 5000,
                "stock_id": 2
            }
        ],
        "user_id": 1
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
        "error": "No portfolio found"
    }
    ```


## Delete your portfolio

Deletes an existing portfolio and adds total balance to account balance


* Require Authentication: true
* Require proper authorization: true
* Request
* Method: DELETE
* Route path: api/portfolio/:user_id/:portfolio_id
* Body: none


* Successful Response
* Status Code: 200
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
      "message": "Portfolio deleted and funds added to account balance"
    }
    ```


* Error response: Couldn't find a portfolio with the specified id
* Status Code: 404
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
      "message": "No portfolio found"
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

# Stocks

## Get all stocks

Returns all the stocks.


* Require Authentication: false
* Request
  * Method: GET
  * Route path: api/stock
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
  [
    {
        "industry": "Consumer Electronics",
        "name": "AAPL",
        "price": 236.76
    },
    {
        "industry": "Software - Infrastructure",
        "name": "MSFT",
        "price": 420.6
    },
    {
        "industry": "Internet Content & Information",
        "name": "GOOGL",
        "price": 193.4509
    }
  ]

    ```
## Get details on a stock

Returns the details of a stock specified by its id.


* Require Authentication: false
* Request
* Method: GET
* Route path: api/stock/:stock_id
* Body: none


* Successful Response
* Status Code: 200
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
    "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod. It also provides AppleCare support and cloud services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts, as well as advertising services include third-party licensing arrangements and its own advertising platforms. In addition, the company offers various subscription-based services, such as Apple Arcade, a game subscription service; Apple Fitness+, a personalized fitness service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was founded in 1976 and is headquartered in Cupertino, California.",
    "industry": "Consumer Electronics",
    "name": "aapl",
    "price": 242.7
    }

* Error response: Couldn't find a stock with the specified id
* Status Code: 404
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {"error": "Please enter valid stock ticker"}
    ```
## Buy a stock and add to portfolio

Buy a stock and adds to portfolio


* Require Authentication: true
* Request Method: POST
* Route path: api/stock/buy/:stock_id/:portfolio_id
* Headers:
* Content-Type: application/json
* Body:


    ```json
  {
    "quantity": 1
  }
  ```

* Successful Response
* Status Code: 201
* Headers:
* Content-Type: application/json
* Body:


  ```json
  {
    "message": "Stock purchased!",
    "name": "GameStop Corp.",
    "quantity": 6,
    "total_cost": 197.76
  }

* Error Response: Not enough funds
* Status Code: 400
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
    "error": "Cannot complete order due to insufficient balance"
    }

<!-- ### Update a purchase order 


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
    } -->

### Sell a stock and remove from portfolio


* Require Authentication: true
* Require proper authorization: true
* Request
* Method: DELETE
* Route path: api/stock/sell/:stock_id/:portfolio_id
* Body: none


* Successful Response
* Status Code: 200
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
    "message": "Stock sold!",
    "name": "GameStop Corp.",
    "portfolio_balance": 4769.28,
    "portfolio_total_value": 230.72,
    "quantity": 1,
    "total_cost": 32.96
    }
    ```


* Error response: Sell error, either stock isnt in portfolio or quanity exceeded
* Status Code: 404
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
    "error": "Sell error, either stock isnt in portfolio or quanity exceeded"
    }

# Watchlist

## Get all watchlists

Get all watchlists


* Require Authentication: true
* Require proper authorization: false
* Request
* Method: GET
* Route path: /api/watchlist/:user_id


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
### Users should be able to Create watchlists 


Creates a watchlist


* Require Authentication: true
* Require proper authorization: false
* Request Method: POST
* Route path: api/watchlist/:user_id
* Body: 

```json
  {
    "name": "this a new watchlist",
    "description": "this new watchlist is dope"
  }
```

* Successful Response
* Status Code: 200
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
    "New Watchlist created": {
        "description": "this is a new watchlist that is extremly good at watching",
        "id": 3,
        "name": "this a new watchlist",
        "stocks": [],
        "user_id": 1
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
      "message": "Watchlist couldn't be found"
    }
   ```
## Add a stock to watchlist

Adds stock based on watchlist id if user is watchlist owner.


* Require Authentication: false
* Request
* Method: POST
* Route path: api/watchlist/:user_id/:watchlist_id
* Body: none


* Successful Response
* Status Code: 200
* Headers:
* Content-Type: application/json
* Body:


    ```json
   {
    "stocks": [
      {"stock_id": 2}
    ]
  }

    ```


* Successful Response
* Status Code: 201
* Headers:
* Content-Type: application/json
* Body:


    ```json
    {
    "message": "Successfully updated watchlist",
    "watchlist": {
        "description": "this new watchlist is dope",
        "id": 6,
        "name": "this a new watchlist",
        "stocks": [
            {
                "id": 2,
                "industry": "Specialty Retail",
                "name": "GameStop Corp.",
                "price": 32.96
              }
          ],
          "user_id": 1
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
      "message": "No watchlist found"
    }
    ```
### Users should be able to remove stocks from watchlist based on Watchlist Id
MAYBE SWITCH THIS TO TAKE NO BODY AND TAKE FROM ROUTE

Removes stock from watchlist


* Require Authentication: true
* Require proper authorization: true
* Request
* Method: PUT
* Route path: api/watchlist/:watchlist_id/:stock_id
* Body: 

```json

{
  "stocks": [
    {"stock_id": 1}
  ]
}
```


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
   
# Search

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