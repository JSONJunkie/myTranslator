import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { translate } from "../../actions/lang";

const textArea = {
  width: "60%",
  height: "40%"
};

const Landing = ({ translate, lang: { preTrans, postTrans } }) => {
  const [text, setText] = useState("");

  const onChange = e => {
    setText(e.target.value);
  };

  const handleClick = e => {
    e.preventDefault();
    translate({ text });
  };
  console.log(preTrans);
  console.log(postTrans);

  return (
    <Fragment>
      Welcome to the translator! To begin, enter text below:
      <textarea
        placeholder={"Enter text here..."}
        style={textArea}
        value={text}
        onChange={e => onChange(e)}
      />
      <button onClick={e => handleClick(e)}>Translate</button>
      <div>
        {preTrans.text}
        {postTrans.text}
      </div>
    </Fragment>
  );
};

Landing.propTypes = {
  translate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lang: state.lang
});

export default connect(mapStateToProps, { translate })(Landing);
