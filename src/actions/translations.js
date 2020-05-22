import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  GET_TRANSCOUNT,
  UPDATE_INPUT,
  ADD_HIT,
  GET_DATA,
  SELECT_LANG,
  GET_TRENDING,
  SELECT_TREND_LANG
} from "./types";
import playSound from "../utils/playSound";

export const selectTrendingLang = data => async dispatch => {
  try {
    dispatch({
      type: SELECT_TREND_LANG,
      payload: {
        trendingLang: data
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

export const getTrending = data => async dispatch => {
  try {
    const res = await axios.get("/api/trending?selectLang=" + data);

    if (res.data.length < 1) {
      return dispatch({
        type: GET_TRENDING,
        payload: {
          trending: "none"
        }
      });
    }

    dispatch({
      type: GET_TRENDING,
      payload: {
        trending: res.data
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

export const speak = ({ audioContext, data }) => async dispatch => {
  try {
    const fileReader = new FileReader();

    function dataURLtoBlob(dataUrl) {
      var arr = dataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    fileReader.onload = function (event) {
      const result = event.target.result;
      playSound(audioContext, result);
    };

    fileReader.readAsArrayBuffer(dataURLtoBlob(data));
  } catch (err) {
    console.log(err);
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

export const selectLang = data => async dispatch => {
  try {
    const { from, to } = data;

    const getLang = data => {
      switch (data) {
        case "":
          return "...";
        case "ar":
          return "Arabic";
        case "zh":
          return "Chinese";
        case "zh-TW":
          return "Chinese";
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
    const { preTrans, fromCode, toCode } = data;

    const res = await axios.get(
      "/api/data?preTrans=" + preTrans + "&fromCode=" + fromCode
    );

    if (!res.data) {
      return dispatch(
        getData({ preTrans: "welcome", fromCode: "en", toCode: "es" })
      );
    }
    dispatch({
      type: GET_DATA,
      payload: {
        preTrans: res.data[fromCode].text,
        postTrans: res.data[toCode].text,
        chartData: res.data.hitData,
        audio: res.data[toCode].audio
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

    dispatch(getData(data));

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
