import { TRANSLATE, SPEAK, LISTEN } from "../actions/types";

const initialState = {
  preTrans: "",
  postTrans: "",
  transcribed: "",
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case TRANSLATE:
      const { preTrans, postTrans } = payload;
      return { ...state, preTrans, postTrans };
    case SPEAK:
      return state;
    case LISTEN:
      const { transcribed } = payload;
      return { ...state, transcribed };
    default:
      return state;
  }
}
