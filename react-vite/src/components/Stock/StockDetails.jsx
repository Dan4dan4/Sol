import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To read the URL params

function StockDetails() {
  const { stock_id } = useParams(); // Get stock ticker from URL params
  const [stock, setStock] = useState(null); // Store stock details
  const [error, setError] = useState(null); // Handle any errors

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await fetch(`/api/stock/${stock_id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setStock(data); // Set stock data
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
    <div>
      <h1>{stock.name}</h1>
      <p>Price: {stock.price}</p>
      <p>Industry: {stock.industry}</p>
      <p>{stock.description}</p>
    </div>
  );
}

export default StockDetails;
