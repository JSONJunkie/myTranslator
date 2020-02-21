import axios from "axios";

export const translate = ({ text }) => async dispatch => {
  const res = await axios.get("/api/translator");
  console.log(res.data);
};
