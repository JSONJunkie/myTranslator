import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { translate } from "../../actions/lang";

const textArea = {
  width: "60%",
  height: "20%"
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
      <textarea
        placeholder={"Translated text will appear here..."}
        style={textArea}
        value={postTrans.text}
      />
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
