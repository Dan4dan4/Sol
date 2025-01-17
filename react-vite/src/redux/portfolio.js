const SET_PORTFOLIOS = 'portfolio/getPortfolios';
const SET_SELECTED_PORTFOLIO = 'portfolio/setSelectedPortfolio';
const REMOVE_PORTFOLIO = 'portfolio/removePortfolio';
const CLEAR_SELECTED_PORTFOLIO = 'portfolio/clearPortfolio'

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
    default:
        return state;
  }
}

export default portfolioReducer;
