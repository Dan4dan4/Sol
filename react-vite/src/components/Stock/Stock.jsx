import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './Stock.css'
import { thunkGetWatchlist, thunkSetWatchlist} from  '../../redux/watchlist'
import { useDispatch , useSelector} from 'react-redux';

function Stock() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minVolume, setMinVolume] = useState('');
  const [maxVolume, setMaxVolume] = useState('');
  const { watchlist } = useSelector((state) => state.watchlist);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.session);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('api/stock'); 
        if (response.ok) {
          const data = await response.json();
          setStocks(data); 
          setFilteredStocks(data);
        } else {
          console.error('Error fetching stocks:', response.status);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    dispatch(thunkGetWatchlist(user.id));
    fetchStocks();
  }, [dispatch, user]); 

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu); 
  };
  

  const handleWatchlistSelect = (watchlist) => {
    dispatch(thunkSetWatchlist(watchlist.id)); 
    setShowMenu(false); 
  };
  

  const handleStockClick = (stock_ticker) => {
    navigate(`/stocks/${stock_ticker}`);
  };

  const searchStocks = (nameFilter, minVol, maxVol) => {

    let filtered = [...stocks]; 

    if (nameFilter) {
      filtered = filtered.filter((stock) =>
        stock.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (minVol) {
      filtered = filtered.filter((stock) => stock.volume >= minVol);
    }
    if (maxVol) {
      filtered = filtered.filter((stock) => stock.volume <= maxVol);
    }
    setFilteredStocks(filtered); 
  };

  const handleVolumeFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'minVolume') {
      setMinVolume(value);  
    } else if (name === 'maxVolume') {
      setMaxVolume(value); 
    }
    searchStocks(searchQuery, minVolume, maxVolume); 
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);  
    searchStocks(query);  
  };


  return (
    <>
    <h1>All Stocks listed on Sol</h1>
    <button className='watchlist' onClick={toggleMenu}>Watchlists</button>
    {showMenu && (
      <div className="dropdownwatch">
        <ul>
          {watchlist.map((list) => (
            <li key={list.id} onClick={() => handleWatchlistSelect(list)}>{list.name}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="search-bar-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by stock name..."
          className='searcher'
        />
        <div className="volume-filters">
          <input
            type="number"
            name="minVolume"
            value={minVolume}
            onChange={handleVolumeFilterChange}
            placeholder="Minimum Volume"
          />
          <input
            type="number"
            name="maxVolume"
            value={maxVolume}
            onChange={handleVolumeFilterChange}
            placeholder="Maximum Volume"
          />
        </div>
      </div>

      <div className='stonks'>
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
          {filteredStocks.map((stock, index) => (
            <li key={index} className="stock-item" onClick={() => handleStockClick(stock.name)}>
              <span className="stock-name">{stock.name}</span>
              <span className="stock-open-price">{stock.open_price}</span>
              <span className="stock-high-price">{stock.high_price}</span>
              <span className="stock-low-price">{stock.low_price}</span>
              <span className="stock-volume">{stock.volume}</span>
              <span className="stock-close-price">{stock.close_price}</span> 
              <span className="stock-vwap">{stock.volume_weighted_avg_price}</span> 
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}


export default Stock;
