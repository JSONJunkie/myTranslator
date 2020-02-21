import axios from "axios";
import { TRANSLATE } from "./types";

export const translate = formData => async dispatch => {
  try {
    const body = formData;

    const res = await axios.post("/api/translator", body);

    dispatch({
      type: TRANSLATE,
      payload: { preTrans: formData, postTrans: res.data }
    });
  } catch (err) {
    // console.log(err);
  }

  //   console.log(res.data);
  //   console.log(payload);
};
