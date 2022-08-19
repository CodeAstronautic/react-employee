const initialState = {
  users: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_EMPLOYEES":
      return { ...state, users: action.data };
    case "CREATE_EMPLOYEE":
      return { ...state, users: [...state.users, action.data] };
    default:
      return state;
  }
};

export default rootReducer;
