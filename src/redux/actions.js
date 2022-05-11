export const SET_USER_TITLE = 'SET_USER_TITLE';

export const setTitle = title => dispatch => {
  dispatch({
    type: SET_USER_TITLE,
    payload: title,
  });
};
