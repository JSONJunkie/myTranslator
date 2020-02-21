import { TRANSLATE } from "../actions/types";

const initialState = {
  preTrans: "",
  postTrans: "",
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case TRANSLATE:
      const { preTrans, postTrans } = payload;
      return { ...state, preTrans, postTrans };
    default:
      return state;
  }
}
