import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import './StockDetails.css'
import { useSelector } from "react-redux";

function StockDetails() {
  const { stock_id } = useParams();
  const [stock, setStock] = useState(null); 
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(0);
  const [purchaseError, setPurchaseError] = useState(null);


  const selectedPortfolio = useSelector(state => state.portfolio.selectedPortfolio);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await fetch(`/api/stock/${stock_id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setStock(data); 
        } else {
          setError("Error fetching stock data");
        }
      } catch (error) {
        setError("Error fetching stock data");
      }
    };

    if (stock_id) {
      fetchStockDetails();
    }
  }, [stock_id]);

  const handleBuyStock = async () => {
    if (!selectedPortfolio) {
      setPurchaseError("Please select a portfolio to buy stocks.");
      return;
    }

    try {
      const response = await fetch(`/api/stock/buy/${stock.name}/${selectedPortfolio.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: quantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`Successfully purchased ${quantity} of ${stock.name}!`);
      } else {
        setPurchaseError(data.error || "Error purchasing stock.");
      }
    } catch (error) {
      setPurchaseError("An error occurred while purchasing the stock.");
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!stock) {
    return <div>No data available</div>;
  }

  return (
    <div className="twobox">
      <div className="details">
      <p className="titleme">{stock.name} </p>
      <p className="titleme">Price: ${stock.volume_weighted_avg_price}</p>
      <p>Open Price: ${stock.open_price}</p>
      <p>High Price: ${stock.high_price}</p>
      <p>Low Price: ${stock.low_price}</p>
      <p>Volume: {stock.volume}</p>
      </div>

      <div className="buy">
      <p className="titleme">Buy {stock.name} </p>
      <p className="titleme">Price: ${stock.volume_weighted_avg_price}</p>
      <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          className="quantity-input"
        />
        <button onClick={handleBuyStock} className="buy-button">Buy</button>
        {purchaseError && <p className="error-message">{purchaseError}</p>}
      
      </div>

      <div className="sell">
      <p className="titleme">Sell {stock.name} </p>
      <p className="titleme">Price: ${stock.volume_weighted_avg_price}</p>
      </div>
    </div>
    )
}

export default StockDetails;
