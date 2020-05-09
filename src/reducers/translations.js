import {
  GET_TRANSCOUNT,
  UPDATE_INPUT,
  ADD_HIT,
  GET_DATA
} from "../actions/types";

const initialState = {
  numTrans: "",
  userInput: "",
  chartData: []
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_TRANSCOUNT:
      return { ...state, numTrans: payload.numTrans };
    case UPDATE_INPUT:
      return { ...state, userInput: payload.userInput };
    case GET_DATA:
      return { ...state, chartData: payload.chartData };
    case ADD_HIT:
    default:
      return state;
  }
}
