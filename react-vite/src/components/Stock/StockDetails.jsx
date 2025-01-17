import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import './StockDetails.css'

function StockDetails() {
  const { stock_id } = useParams();
  const [stock, setStock] = useState(null); 
  const [error, setError] = useState(null);

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

  if (error) {
    return <div>{error}</div>;
  }

  if (!stock) {
    return <div>No data available</div>;
  }

  return (
    <div className="stockdetails">
      <p className="titleme">{stock.name} </p>
      <p className="titleme">Price: ${stock.volume_weighted_avg_price}</p>
      <p>Open Price: ${stock.open_price}</p>
      <p>High Price: ${stock.high_price}</p>
      <p>Low Price: ${stock.low_price}</p>
      <p>Volume: {stock.volume}</p>
    </div>
  );
}

export default StockDetails;
