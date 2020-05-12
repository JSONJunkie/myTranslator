import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  GET_TRANSCOUNT,
  UPDATE_INPUT,
  ADD_HIT,
  GET_DATA,
  SELECT_LANG
} from "./types";

export const selectLang = data => async dispatch => {
  try {
    const { from, to } = data;

    const getLang = data => {
      switch (data) {
        case "ar":
          return "Arabic";
        case "zh":
          return "Simplified Chinese";
        case "zh-TW":
          return "Traditional Chinese";
        case "en":
          return "English";
        case "fi":
          return "Finnish";
        case "fr":
          return "French";
        case "de":
          return "German";
        case "it":
          return "Italian";
        case "ja":
          return "Japanese";
        case "ko":
          return "Korean";
        case "pt":
          return "Portuguese";
        case "ro":
          return "Romanian";
        case "ru":
          return "Russian";
        case "sk":
          return "Slovak";
        case "es":
          return "Spanish";
        case "sv":
          return "Swedish";
        case "th":
          return "Thai";
        case "tr":
          return "Turkish";
        case "vi":
          return "Vietnamese";
      }
    };

    dispatch({
      type: SELECT_LANG,
      payload: {
        fromCode: data.from,
        from: getLang(data.from),
        toCode: data.to,
        to: getLang(data.to)
      }
    });
  } catch (err) {
    // rollbar.error(err);
    // dispatch({
    //   type: ERROR,
    //   payload: {
    //     name: err.name,
    //     message: err.message
    //   }
    // });
  }
};

export const getData = data => async dispatch => {
  try {
    const res = await axios.get(
      "/api/data?preTrans=" + data.preTrans + "&fromCode=" + data.from
    );

    dispatch({
      type: GET_DATA,
      payload: {
        preTrans: res.data.preTrans,
        postTrans: res.data.postTrans,
        chartData: res.data.hitData
      }
    });
  } catch (err) {
    // rollbar.error(err);
    // dispatch({
    //   type: ERROR,
    //   payload: {
    //     name: err.name,
    //     message: err.message
    //   }
    // });
  }
};

export const addHit = data => async dispatch => {
  try {
    const body = { data };

    await axios.patch("/api/translations", body);

    dispatch({
      type: ADD_HIT
    });
  } catch (err) {
    // rollbar.error(err);
    // dispatch({
    //   type: ERROR,
    //   payload: {
    //     name: err.name,
    //     message: err.message
    //   }
    // });
  }
};

export const updateInput = data => async dispatch => {
  try {
    dispatch({
      type: UPDATE_INPUT,
      payload: { userInput: data }
    });
  } catch (err) {
    // rollbar.error(err);
    // dispatch({
    //   type: ERROR,
    //   payload: {
    //     name: err.name,
    //     message: err.message
    //   }
    // });
  }
};

export const numOfTranslations = () => async dispatch => {
  try {
    const res = await axios.get("/api/translations");
    dispatch({
      type: GET_TRANSCOUNT,
      payload: { numTrans: res.data }
    });
  } catch (err) {
    // rollbar.error(err);
    // dispatch({
    //   type: ERROR,
    //   payload: {
    //     name: err.name,
    //     message: err.message
    //   }
    // });
  }
};
