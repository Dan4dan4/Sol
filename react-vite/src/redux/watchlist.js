const SET_WATCHLIST = 'watchlist/setWatchlist';
const SET_SELECTED_WATCHLIST = 'watchlist/setSelectedWatchlist';


const setWatchlist = (watchlist) => ({
  type: SET_WATCHLIST,
  payload: watchlist,
});

const setSelectedWatchlist = (watchlist) => ({
    type:SET_SELECTED_WATCHLIST,
    payload: watchlist,
  });

export const thunkGetWatchlist = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/watchlist/${userId}`);
        if (response.ok) {
            const data = await response.json();
            // console.log("Data:", data); 
            dispatch(setWatchlist(data.watchlist || []));
        } else {
            console.error('Failed to fetch watchlist');
        }
    } catch (error) {
        console.error('Error fetching:', error);
    }
};

export const thunkSetWatchlist = (watchlistId) => async (dispatch, getState) => {
	const { watchlist } = getState().watchlist;
    const selectedWatchlist = watchlist.find((watchlist) => watchlist.id === watchlistId);

    if (selectedWatchlist) {
        dispatch(setSelectedWatchlist(selectedWatchlist));
    } else {
        console.error('Watchlist not found');
    }
};


export const thunkAddStockToWatchlist = (userId, watchlistId, stockId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/watchlist/${userId}/${watchlistId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stocks: [{ stock_id: stockId }],
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // console.log("Data:", data);
        dispatch(setSelectedWatchlist(data.watchlist)); 
      } else {
        console.error('Failed to add stock to watchlist');
      }
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
    }
  };
  

  export const thunkRemoveStockFromWatchlist = (userId, watchlistId, stockId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/watchlist/${userId}/${watchlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stocks: [{ stock_id: stockId }],
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        dispatch(setSelectedWatchlist(data.watchlist)); 
      } else {
        console.error('Failed to remove stock from watchlist');
      }
    } catch (error) {
      console.error('Error removing stock from watchlist:', error);
    }
  };

const initialState = { 
    watchlist: [],
    selectedWatchlist: null,
    error: null};

function watchlistReducer(state = initialState, action) {
  switch (action.type) {
    case SET_WATCHLIST:
        // console.log("Action Payload:", action.payload);
        return { ...state, watchlist: action.payload };
    case SET_SELECTED_WATCHLIST:
        return { ...state, selectedWatchlist: action.payload };
    default:
        return state;
  }
}

export default watchlistReducer;
