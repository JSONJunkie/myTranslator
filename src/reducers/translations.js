import { GET_TRANSCOUNT, UPDATE_INPUT } from "../actions/types";

const initialState = {
  numTrans: "",
  userInput: ""
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_TRANSCOUNT:
      return { ...state, numTrans: payload.numTrans };
    case UPDATE_INPUT:
      return { ...state, userInput: payload.userInput };
    default:
      return state;
  }
}
