import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAddStockToWatchlist, thunkRemoveStockFromWatchlist } from '../../redux/watchlist';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router';

function Watchlist() {
  const [stocks, setStocks] = useState([]);
  const { watchlist, selectedWatchlist } = useSelector((state) => state.watchlist);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.session);
  const [starredStocks, setStarredStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockDetails = async () => {
      if (!selectedWatchlist || !selectedWatchlist.stocks) return;

      try {
        const stockDetailsPromises = selectedWatchlist.stocks.map(async (stock) => {
          const response = await fetch(`/api/stock/${stock.name}`);
          if (response.ok) {
            return await response.json();
          } else {
            console.error('Error fetching stock data:', response.status);
            return null;
          }
        });

        const stockDetails = await Promise.all(stockDetailsPromises);
        setStocks(stockDetails.filter((stock) => stock !== null));
      } catch (error) {
        console.error('Error fetching stock details:', error);
      }
    };

    fetchStockDetails();
  }, [selectedWatchlist]);

  useEffect(() => {
    if (watchlist && watchlist.length > 0) {
      const selectedWatchlist = watchlist.find((list) => list.user_id === user.id);
      if (selectedWatchlist) {
        setStarredStocks(selectedWatchlist.stocks.map((stock) => stock.name));
      }
    }
  }, [watchlist, user.id]);

  const handleToggleWatchlist = async (stock) => {
    if (!user || !selectedWatchlist) {
      console.error('No user or selected watchlist.');
      return;
    }

    if (isStockStarred(stock)) {
      await dispatch(thunkRemoveStockFromWatchlist(user.id, selectedWatchlist.id, stock));
      setStarredStocks(starredStocks.filter((name) => name !== stock.name));
      alert(`${stock.name} has been removed from your watchlist!`);
    } else {
      await dispatch(thunkAddStockToWatchlist(user.id, selectedWatchlist.id, stock));
      setStarredStocks([...starredStocks, stock.name]);
    }
  };

  const isStockStarred = (stock) => {
    return starredStocks.includes(stock.name);
  };

  const handleStockClick = (stock_ticker) => {
    navigate(`/stocks/${stock_ticker}`);
  };

  return (
    <div className="watchlist-container">
      <h1>All Stocks in Your Watchlist</h1>
      {selectedWatchlist && <h2>Viewing Watchlist: {selectedWatchlist.name}</h2>}
      <div className="stonks">
        <div className="stock-header">
          <span className="stock-label">Ticker</span>
          <span className="stock-label">Open Price</span>
          <span className="stock-label">High Price</span>
          <span className="stock-label">Low Price</span>
          <span className="stock-label">Volume</span>
          <span className="stock-label">Close Price</span>
          <span className="stock-label">Price</span>
        </div>
        <ul>
          {stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <li
                key={index}
                className="stock-item"
                onClick={() => handleStockClick(stock.name)}
              >
                <span className="stock-name">{stock.name}</span>
                <span className="stock-open-price">{stock.open_price}</span>
                <span className="stock-high-price">{stock.high_price}</span>
                <span className="stock-low-price">{stock.low_price}</span>
                <span className="stock-volume">{stock.volume}</span>
                <span className="stock-close-price">{stock.close_price}</span>
                <span className="stock-vwap">{stock.volume_weighted_avg_price}</span>
                <span
                  className="stock-star"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWatchlist(stock); 
                  }}
                >
                  {isStockStarred(stock) ? <FaStar /> : <FaRegStar />}
                </span>
              </li>
            ))
          ) : (
            <p>No stocks available in your watchlist.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Watchlist;
