import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { GET_TRANSCOUNT } from "./types";

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
