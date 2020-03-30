import {
  TRANSLATE,
  SPEAK,
  LISTEN,
  TRANSLATE_TRANSCRIPTION,
  SAVE,
  CLEAR,
  DELETE_SAVED
} from "../actions/types";

const initialState = {
  preTrans: "",
  postTrans: "",
  transcribed: "",
  translatedTranscription: "",
  saved: JSON.parse(localStorage.getItem("savedTranslations")) || [],
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
    case DELETE_SAVED:
      const { transId } = payload;
      return {
        ...state,
        saved: state.saved.filter(translation => {
          return translation.transId !== transId;
        })
      };
    case SAVE:
      return { ...state, saved: [...state.saved, payload] };
    case CLEAR:
      return { ...state, preTrans: "", postTrans: "" };
    default:
      return state;
  }
}
