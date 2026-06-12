import { combineReducers } from "redux";

import authReducer from "./authReducers";
//import userReducer from "./userReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  //user: userReducer,
});

export default rootReducer;