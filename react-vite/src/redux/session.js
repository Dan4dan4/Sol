const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_ACCOUNT_BALANCE = 'session/setAccountBalance'

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

const setAccountBalance = (balance) => ({
  type: SET_ACCOUNT_BALANCE,
  payload: balance,
});

export const thunkUpdateAccountBalance = (user_id, newBalance) => async (dispatch) => {
  const response = await fetch(`/api/users/${user_id}/account_balance`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account_balance: parseFloat(newBalance) }), 
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setAccountBalance(data.account_balance));
  } else {
    console.error('Error updating account balance:', response.status);
  }
};


const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case SET_ACCOUNT_BALANCE:
      return {
        ...state,
        user: {
          ...state.user,
          account_balance: action.payload,
        },
      };
    default:
      return state;
  }
}

export default sessionReducer;
