import { combineReducers } from "redux";

import lang from "./lang";
import translations from "./translations";

export default combineReducers({ lang, translations });
