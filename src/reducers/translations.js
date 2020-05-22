import {
  GET_TRANSCOUNT,
  UPDATE_INPUT,
  ADD_HIT,
  GET_DATA,
  SELECT_LANG,
  GET_TRENDING,
  SELECT_TREND_LANG
} from "../actions/types";

const initialState = {
  numTrans: "",
  userInput: "",
  preTrans: "",
  postTrans: "",
  fromCode: "",
  from: "...",
  toCode: "",
  to: "...",
  audio: "",
  trendingLang: "en",
  trending: [],
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
      return {
        ...state,
        preTrans: payload.preTrans,
        postTrans: payload.postTrans,
        chartData: payload.chartData,
        audio: payload.audio
      };
    case SELECT_LANG:
      return {
        ...state,
        from: payload.from,
        to: payload.to,
        fromCode: payload.fromCode,
        toCode: payload.toCode
      };
    case GET_TRENDING:
      return { ...state, trending: payload.trending };
    case SELECT_TREND_LANG:
      return { ...state, trendingLang: payload.trendingLang };
    case ADD_HIT:
    default:
      return state;
  }
}
