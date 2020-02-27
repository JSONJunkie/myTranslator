import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { translate, speak } from "../../actions/lang";

const textArea = {
  width: "60%",
  height: "20%"
};

const Landing = ({ translate, lang: { postTrans } }) => {
  const [text, setText] = useState("");

  const onChange = e => {
    setText(e.target.value);
  };

  const handleClick = e => {
    e.preventDefault();
    translate(text);
  };

  const handleClick2 = e => {
    e.preventDefault();
    speak(postTrans);
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
        value={postTrans}
        readOnly
      />
      <button onClick={e => handleClick2(e)}>Speak!</button>
    </Fragment>
  );
};

Landing.propTypes = {
  translate: PropTypes.func.isRequired,
  speak: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lang: state.lang
});

export default connect(mapStateToProps, { translate, speak })(Landing);
