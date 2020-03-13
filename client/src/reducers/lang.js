import {
  TRANSLATE,
  SPEAK,
  LISTEN,
  TRANSLATE_TRANSCRIPTION
} from "../actions/types";

const initialState = {
  preTrans: "",
  postTrans: "",
  transcribed: "",
  translatedTranscription: "",
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
    case TRANSLATE_TRANSCRIPTION:
      const { translatedTranscription } = payload;
      return { ...state, translatedTranscription };
    default:
      return state;
  }
}
