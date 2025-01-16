import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './Stock.css'

function Stock() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

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

  const handleStockClick = (stock_ticker) => {
    navigate(`/stocks/${stock_ticker}`);
  };


  return (
    <>
    <h1>All Stocks listed on Sol.com</h1>
      <div className='stonks'>
        <div className="stock-header">
          <span className="stock-label">Ticker</span>
          <span className="stock-label">Open Price</span>
          <span className="stock-label">High Price</span>
          <span className="stock-label">Low Price</span>
          <span className="stock-label">Volume</span>
        </div>
        <ul>
          {stocks.map((stock, index) => (
            <li key={index} className="stock-item" onClick={() => handleStockClick(stock.name)}>
              <span className="stock-name">{stock.name}</span>
              <span className="stock-open-price">{stock.open_price}</span>
              <span className="stock-high-price">{stock.high_price}</span>
              <span className="stock-low-price">{stock.low_price}</span>
              <span className="stock-volume">{stock.volume}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}


export default Stock;
