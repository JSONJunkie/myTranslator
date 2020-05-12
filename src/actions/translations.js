import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { GET_TRANSCOUNT, UPDATE_INPUT, ADD_HIT, GET_DATA } from "./types";

export const getData = data => async dispatch => {
  try {
    const res = await axios.get("/api/data?translation=" + data);

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
