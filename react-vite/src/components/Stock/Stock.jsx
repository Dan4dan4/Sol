import { useEffect, useState } from 'react';
import './Stock.css'

function Stock() {
  const [stocks, setStocks] = useState([]);

  // Fetch stocks when the component mounts
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('api/stock'); 
        if (response.ok) {
          const data = await response.json();
          setStocks(data); 
        } else {
          console.error('Error fetching stocks:', response.status);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, []); 

  return (
    <>
    <h1>All Stocks</h1>
    <div className='stonks'>
      <ul>
        {stocks.map((stock, index) => (
          <li key={index}>
            {stock.name}<br />
            Price: {stock.price}<br />
            Industry: {stock.industry}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default Stock;
