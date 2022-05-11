import {SET_USER_TITLE} from './actions';

const initialState = {
  title: '',
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_TITLE:
      return {...state, title: action.payload};
    default:
      return state;
  }
}

export default userReducer;
