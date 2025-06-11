import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './Stock.css'
import { thunkGetWatchlist, thunkSetWatchlist, thunkAddStockToWatchlist,thunkRemoveStockFromWatchlist, thunkCreateWatchlist} from  '../../redux/watchlist'
import { useDispatch , useSelector} from 'react-redux';
import { FaStar, FaRegStar, FaArrowCircleRight } from 'react-icons/fa';
import {useModal} from '../../context/Modal'

function Stock() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minVolume, setMinVolume] = useState('');
  const [maxVolume, setMaxVolume] = useState('');
  const { watchlist, selectedWatchlist } = useSelector((state) => state.watchlist);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.session);
  const [starredStocks, setStarredStocks] = useState([]);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const { setModalContent, setOnModalClose } = useModal();

  // useEffect(() => {
  //   const fetchStocks = async () => {
  //     try {
  //       const response = await fetch('api/stock');
  //       if (response.ok) {
  //         const data = await response.json();
  //         setStocks(data);
  //         setFilteredStocks(data);
  //       } else {
  //         console.error('Error fetching stocks:', response.status);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching stocks:', error);
  //     }
  //   };
    
  //   fetchStocks(); 
  
  //   if (user && user.id) {
  //     dispatch(thunkGetWatchlist(user.id));
  //   }
  // }, [dispatch, user]); 
  
useEffect(() => {
  const fetchStocks = async () => {
    try {
      // const protocol = window.location.protocol;
      // const baseURL = window.location.origin;


      const response = await fetch(`/stocks`);
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

  fetchStocks();

  if (user && user.id) {
    dispatch(thunkGetWatchlist(user.id));
  }
}, [dispatch, user]);

  
  

  // useEffect(() => {
  //   if (watchlist && watchlist.length > 0) {
  //     const selectedWatchlist = watchlist.find(list => list.user_id === user.id);
  //     if (selectedWatchlist) {
  //       setStarredStocks(selectedWatchlist.stocks.map(stock => stock.id)); 
  //     }
  //   }
  // }, [watchlist, user.id]);

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu); 
  };
  

  const handleWatchlistSelect = (watchlist) => {
    dispatch(thunkSetWatchlist(watchlist.id)); 
    setShowMenu(false); 
    // navigate(`/watchlist/${watchlist.id}`);
    setModalContent(
      <div>
        <h2>Watchlist Selected:{watchlist.name}</h2>
        <p>Click the star on any stock to add it to &quot;{watchlist.name}&quot; from this page!</p>
        {/* <p></p> */}
      </div>
    );
    setOnModalClose(() => {
      // Any additional logic you want when closing the modal
    });
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

  const toggleStockStar = async (stock) => {
    if (!user || !watchlist || !watchlist.length) {
      console.error('User or watchlist not found.');
      return;
    }
    if (!selectedWatchlist) {
      console.error('No selected watchlist found');
      setModalContent(
        <div>
          <h2>No Watchlist Selected</h2>
          <p>Please select a watchlist</p>
        </div>
      );
      setOnModalClose(() => {
      });
      return;
    }
    if (starredStocks.includes(stock)) {
      await dispatch(thunkRemoveStockFromWatchlist(user.id, selectedWatchlist.id, stock));
      setStarredStocks(starredStocks.filter((name) => name !== stock));
      // alert(`${stock.name} has been removed from your watchlist!`);
      setModalContent(
        <div>
          <h2>Success!</h2>
          <p>{stock.name} has been removed from your watchlist!</p>
        </div>
      );
      setOnModalClose(() => {
      });
    } else {
      await dispatch(thunkAddStockToWatchlist(user.id, selectedWatchlist.id, stock));
      setStarredStocks([...starredStocks, stock]);
      // alert(`${stock.name} has been added to your watchlist!`);
      setModalContent(
        <div>
          <h2>Success!</h2>
          <p>{stock.name} has been added to your watchlist!</p>
        </div>
      );
      setOnModalClose(() => {
      });

    }
};

const isStockStarred = (stock) => {
  // console.log('Checking stock ID:', stock);
  // console.log('Starred Stocks:', starredStocks);
  return starredStocks.includes(stock);
};

  
const navigateToWatchlist = () => {
  if (selectedWatchlist) {
    navigate(`/watchlist/${selectedWatchlist.id}`);
  }
};
  
const handleCreateWatchlist = async () => {
  if (!newWatchlistName) {
    alert('Please provide a name for the new watchlist!');
    return;
  }
  await dispatch(thunkCreateWatchlist(user.id, newWatchlistName)); 
  setNewWatchlistName(''); 
};

return (
  <>
    <h1 className='tittleonstock'>All Stocks listed on Sol</h1>

    {/* Conditional rendering based on user existence */}
    {user && selectedWatchlist && (
      <h2 className='tittleonstock'>
        Modifying Watchlist:  
        <span className="watchlist-name" onClick={navigateToWatchlist}>
          {selectedWatchlist.name}
        </span>
        <FaArrowCircleRight className="goto-icon" onClick={navigateToWatchlist} />
      </h2>
    )}

    {/* Watchlist button only visible if the user is logged in */}
    {user && (
      <>
        <button className='watchlist' onClick={toggleMenu}>Watchlists</button>
        {showMenu && (
          <div className="dropdownwatch">
            <div className="create-watchlist">
              <input 
                type="text" 
                value={newWatchlistName} 
                onChange={(e) => setNewWatchlistName(e.target.value)} 
                placeholder="Enter new watchlist name"
              />
              <button onClick={handleCreateWatchlist}>Create</button>
            </div>
            <ul>
              {watchlist.map((list) => (
                <li key={list.id} onClick={() => handleWatchlistSelect(list)}>{list.name}</li>
              ))}
            </ul>
          </div>
        )}
      </>
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
            {user && (
              <span className="stock-star" onClick={(e) => { e.stopPropagation(); toggleStockStar(stock); }}>
                {isStockStarred(stock) ? <FaStar /> : <FaRegStar />}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  </>
);
}


export default Stock;
