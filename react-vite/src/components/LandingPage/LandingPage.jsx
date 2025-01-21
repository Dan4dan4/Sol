import { useEffect, useState } from 'react';
import './LandingPage.css'; 
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import up from '../../../images/upme.avif'
import up2 from '../../../images/upme2.avif'
import up3 from '../../../images/upme5.webp'

function LandingPage() {
  const [stockPrices, setStockPrices] = useState([]); 
  const session = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

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
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 2 ? 0 : prev+1));
    }, 3000);

    return () => clearInterval(interval); 
  }, []);


  
  return (
    <div className="landing-container">
      <div className="text-section">
        <ul>
          <li>Trading made easy</li>
          <li>Sol Commission-free trading</li>
          <li>The price you see, is the price you get</li>
          <li>Real time stock data</li>
        </ul>
        {!session && (
          <button onClick={getstarted} className="getstarted">
            Get started
          </button>
        )}
      </div>

      <div className="image-section">
        <div className="image-container">
          <img
            src={up}
            className={`image ${currentImage === 0 ? 'fade-in' : 'fade-out'}`}
            alt="Up image"
          />
          <img
            src={up2}
            className={`image ${currentImage === 1 ? 'fade-in' : 'fade-out'}`}
            alt="Up2 image"
          />
          <img
            src={up3}
            className={`image ${currentImage === 2 ? 'fade-in' : 'fade-out'}`}
            alt="Up3 image"
          />
        </div>
      </div>

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
