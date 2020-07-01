import {
  TRANSLATE,
  SPEAK,
  STORE_TRANSLATED_AUDIO,
  LISTEN,
  TRANSLATE_TRANSCRIPTION,
  SAVE,
  CLEAR,
  DELETE_SAVED,
  PUSH_TRANS,
  ERROR,
  CLEAR_ERROR,
} from "actions/types";

const initialState = {
  transId: "",
  preTrans: "",
  postTrans: "",
  translatedAudio: "",
  transcribed: "",
  translatedTranscription: "",
  translations: [],
  saved:
    (typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("savedTranslations"))) ||
    [],
  savedSuccess: "",
  error: "",
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case TRANSLATE:
      const { preTrans, postTrans } = payload;
      return { ...state, transId: payload.transId, preTrans, postTrans };
    case STORE_TRANSLATED_AUDIO:
      const { translatedAudio } = payload;
      return {
        ...state,
        translatedAudio,
        translations: state.translations.map((translation) => {
          if (translation.transId === payload.transId) {
            return { ...translation, translatedAudio };
          } else return translation;
        }),
      };
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
        saved: state.saved.filter((translation) => {
          return translation.transId !== transId;
        }),
        translations: state.translations.map((translation) => {
          if (translation.transId === transId) {
            return { ...translation, stored: false };
          } else return translation;
        }),
      };
    case SAVE:
      return {
        ...state,
        savedSuccess: true,
        saved: [...state.saved, payload],
        translations: state.translations.map((translation) => {
          if (translation.transId === payload.transId) {
            return {
              ...translation,
              stored: true,
              translatedAudio: payload.translatedAudio,
            };
          } else return translation;
        }),
      };
    case PUSH_TRANS:
      return { ...state, translations: [...state.translations, payload] };
    case CLEAR:
      return {
        ...state,
        preTrans: "",
        postTrans: "",
        translatedAudio: "",
        savedSuccess: "",
        transcribed: "",
        translatedTranscription: "",
      };
    case ERROR:
      return { ...state, error: payload };
    case CLEAR_ERROR:
      return { ...state, error: "" };
    case SPEAK:
    default:
      return state;
  }
}
