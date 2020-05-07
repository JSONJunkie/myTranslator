import { GET_TRANSCOUNT } from "../actions/types";

const initialState = {
  numTrans: ""
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_TRANSCOUNT:
      return { ...state, numTrans: payload.numTrans };
    default:
      return state;
  }
}
