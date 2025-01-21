const SET_WATCHLIST = 'watchlist/setWatchlist';
const SET_SELECTED_WATCHLIST = 'watchlist/setSelectedWatchlist';
const DELETE_WATCHLIST = 'watchlist/deleteWatchlist'
const CREATE_WATCHLIST = 'watchlist/createWatchlist'
const CLEAR_WATCHLIST = 'watchlist/clearWatchlist'


const setWatchlist = (watchlist) => ({
  type: SET_WATCHLIST,
  payload: watchlist,
});

const setSelectedWatchlist = (watchlist) => ({
    type:SET_SELECTED_WATCHLIST,
    payload: watchlist,
  });

const deleteWatchlist = (watchlistId) => ({
  type: DELETE_WATCHLIST,
  payload: watchlistId
})

const createWatchlist = (watchlist) => ({
  type: CREATE_WATCHLIST,
  payload: watchlist
})

const clearWatchlist = () => ({
  type: CLEAR_WATCHLIST
})

export const thunkClearWatchlist = () => async (dispatch) => {
  dispatch(clearWatchlist());
};

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


export const thunkAddStockToWatchlist = (userId, watchlistId, stock) => async (dispatch) => {

  if (!stock || !stock.name) {
      console.error('Error: stock is undefined or missing name');
      return; 
  }
  console.log('Stock Name being passed:', stock.name); 
  try {
      const response = await fetch(`/api/watchlist/${userId}/${watchlistId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stocks: [
              { stock_name: stock.name } 
            ]
          }),
      });
      if (response.ok) {
          const data = await response.json();
          dispatch(setSelectedWatchlist(data.watchlist));
      } else {
          const errorData = await response.json();
          console.error('Error:', errorData.error || 'Failed to add stock to watchlist');
      }
  } catch (error) {
      console.error('Error adding stock to watchlist:', error);
  }
};




export const thunkRemoveStockFromWatchlist = (userId, watchlistId, stock) => async (dispatch) => {

  if (!stock || !stock.name) {
      console.error('Error: stock is undefined or missing name');
      return; 
  }
  console.log('Stock Name being passed for removal:', stock.name); 
  try {
    const response = await fetch(`/api/watchlist/${userId}/${watchlistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stocks: [
          { stock_name: stock.name } 
        ],
      }),
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(setSelectedWatchlist(data.watchlist)); 
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData.error || 'Failed to remove stock from watchlist');
    }
  } catch (error) {
    console.error('Error removing stock from watchlist:', error);
  }
};

export const thunkDeleteWatchlist = (userId, watchlistId) => async (dispatch) => {
  try{
    const response = await fetch(`/api/watchlist/${userId}/${watchlistId}`, {
      method: 'DELETE',
      headers:{
                'Content-Type': 'application/json',
            },
        });
    if (response.ok){
      dispatch(deleteWatchlist(watchlistId));
    } else{
      const errorData = await response.json();
      console.log('Errror', errorData.error || 'failed to delete')
    }
  } catch (error) {
    console.error('Error deleting watchlsit', error)
  }
}

export const thunkCreateWatchlist = (userId, name) => async (dispatch) => {
  try{
    const response = await fetch(`/api/watchlist/${userId}`, {
      method: 'POST',
      headers:{
                'Content-Type': 'application/json',
            },
      body: JSON.stringify({name}),
        });

    if (response.ok){
      const data = await response.json();
      dispatch(createWatchlist(data['New Watchlist created'])); 
    } else {
      const errorData = await response.json();
      console.error('Error creating watchlist:', errorData.error);
    }
  } catch (error) {
    console.error('Error creating watchlist:', error);
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
    case CREATE_WATCHLIST:
        return {...state, watchlist: [...state.watchlist, action.payload]}
    case DELETE_WATCHLIST:
        return{...state, watchlist:state.watchlist.filter(watchlist => watchlist.id !==action.payload)}
    case CLEAR_WATCHLIST:
      return{...state,selectedWatchlist:null}
        default:
        return state;
  }
}

export default watchlistReducer;
