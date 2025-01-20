import { useEffect, useState } from 'react';
import './LandingPage.css'; 
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function LandingPage() {
  const [stockPrices, setStockPrices] = useState([]); 
  const session = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const getstarted = () => {
    navigate('/signup');
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('api/stock'); 
        if (response.ok) {
          const data = await response.json();
          const prices = data.map((stock) => `${stock.name}: $${stock.volume_weighted_avg_price}`);
          setStockPrices(prices);
        }
      } catch (err) {
        console.error('Failed to fetch price data', err);
      }
    };

    fetchStockData();
  }, []);

  return (
    <div className="landing-container">
      <li>Trading made easy</li>
      <li>Sol Commission-free trading</li>
      <li>The price you see, is the price you get!</li>
      {!session && (
        <button onClick={getstarted} className="getstarted">
          Get started
        </button>
      )}

      <div className="stock-ticker">
        <div className="ticker-content">
          {stockPrices.map((price, index) => (
            <span key={index} className="ticker-symbol">{price}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
