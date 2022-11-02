export const ratingReducer = (state = [], action) => {
  switch (action.type) {
    case "SAVE_RATING": {
      let existing = state.some((item) => item.id === action.payload.id);
      if (!existing) {
        let newState = [action.payload, ...state];
        state = newState;
        return state;
      } else {
        let newState = state.map((item, index) => {
          if (item.id === action.payload.id) {
            item.rating = action.payload.rating;
          }
          return item;
        });
        state = newState;
      }
    }
    default:
      return state;
  }
};
