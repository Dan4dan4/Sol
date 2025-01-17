const SET_PORTFOLIOS = 'portfolio/setPortfolios';
const SET_SELECTED_PORTFOLIO = 'portfolio/setSelectedPortfolio';

const setPortfolios = (portfolios) => ({
  type: SET_PORTFOLIOS,
  payload: portfolios,
});

const setSelectedPortfolio = (portfolios) => ({
    type: SET_SELECTED_PORTFOLIO,
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
        console.error('Error fetching portfolios:', error);
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
    default:
        return state;
  }
}

export default portfolioReducer;
