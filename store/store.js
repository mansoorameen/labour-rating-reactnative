import { createStore } from "redux";
import { ratingReducer } from "./reducer";

// const allReducers = combineReducers({ counterReducer, ratingReducer });
const store = createStore(ratingReducer);
export default store;
