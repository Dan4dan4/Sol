const SET_PORTFOLIOS = 'portfolio/getPortfolios';
const SET_SELECTED_PORTFOLIO = 'portfolio/setSelectedPortfolio';
const REMOVE_PORTFOLIO = 'portfolio/removePortfolio';
const CLEAR_SELECTED_PORTFOLIO = 'portfolio/clearPortfolio'
const ADD_STOCK_TO_PORTFOLIO = 'portfolio/addStockToPortfolio';
const UPDATE_PORTFOLIO = 'portfolio/updatePortfolio'
const removePortfolio = (portfolioId) => ({
  type:REMOVE_PORTFOLIO,
  payload: portfolioId,
});



export const clearSelectedPortfolio = () => ({
    type: CLEAR_SELECTED_PORTFOLIO,
});

const setPortfolios = (portfolios) => ({
  type: SET_PORTFOLIOS,
  payload: portfolios,
});

const setSelectedPortfolio = (portfolios) => ({
    type:SET_SELECTED_PORTFOLIO,
    payload: portfolios,
  });


export const updatePortfolio = (portfolio) => ({
  type:"UPDATE_PORTFOLIO",
  payload: portfolio
});


export const thunkPurchaseStock = (portfolioId, stockTicker, quantity) => async (dispatch) => {
  try {
    const response = await fetch(`/api/stock/buy/${stockTicker}/${portfolioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    const data = await response.json();
    if (response.ok) {
      dispatch(updatePortfolio(data.portfolio)); 
      return data; 
    } else {
      return { error: data.error || 'Failed to purchase stock.' };
    }
  } catch (error) {
    return { error: 'Error purchasing stock.' };
  }
};

export const thunkGetPortfolios = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/portfolio/${userId}`);
        if (response.ok) {
            const data = await response.json();
            // console.log("Data:", data); 
            dispatch(setPortfolios(data.portfolios || []));
        } else {
            console.error('Failed to fetch portfolios');
        }
    } catch (error) {
        console.error('Error fetching:', error);
    }
};

export const thunkSetPortfolio = (portfolioId) => async (dispatch, getState) => {
	const { portfolios } = getState().portfolio;
    const selectedPortfolio = portfolios.find((portfolio) => portfolio.id === portfolioId);

    if (selectedPortfolio) {
        dispatch(setSelectedPortfolio(selectedPortfolio));
    } else {
        console.error('Portfolio not found');
    }
};

export const thunkDeletePortfolio = (userId, portfolioId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/portfolio/${userId}/${portfolioId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        dispatch(removePortfolio(portfolioId));
      } else {
        const data = await response.json();
        console.error(data.error || 'Error deleting portfolio');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };
  

const initialState = { 
    portfolios: [],
    selectedPortfolio: null,
    error: null};

function portfolioReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PORTFOLIOS:
        // console.log("Action Payload:", action.payload);
        return { ...state, portfolios: action.payload };
    case SET_SELECTED_PORTFOLIO:
        return { ...state, selectedPortfolio: action.payload };
    case REMOVE_PORTFOLIO:
        return {
        ...state,
        portfolios: state.portfolios.filter(
          (portfolio) => portfolio.id !== action.payload
        ),
      };
    case CLEAR_SELECTED_PORTFOLIO:  
        return { ...state, selectedPortfolio: null };
    case ADD_STOCK_TO_PORTFOLIO:
        {const { portfolioId, stock } = action.payload;
        return {
          ...state,
          portfolios: state.portfolios.map((portfolio) => {
            if (portfolio.id === portfolioId) {
              return {
                ...portfolio,
                balance: portfolio.balance - stock.total_cost, 
                stocks: [...portfolio.stocks, stock] 
              };
            }
            return portfolio;
          }),
          selectedPortfolio: state.selectedPortfolio?.id === portfolioId
            ? { 
                ...state.selectedPortfolio,
                balance: state.selectedPortfolio.balance - stock.total_cost,
                stocks: [...state.selectedPortfolio.stocks, stock]
              }
            : state.selectedPortfolio
          };}
    case UPDATE_PORTFOLIO:
      {const updatedPortfolio = { ...action.payload }; 
      updatedPortfolio.stocks = updatedPortfolio.stocks.map((stock) => {

        if (stock.name === action.payload.stockName) {
          stock.quantity += action.payload.quantity; 
        }
        return stock;
      });
      return {
        ...state,
        selectedPortfolio: updatedPortfolio,
        portfolios: state.portfolios.map((portfolio) => {
          if (portfolio.id === updatedPortfolio.id) {
            return updatedPortfolio;
          }
          return portfolio;
        }),
      };}
    default:
        return state;
  }
}

export default portfolioReducer;
