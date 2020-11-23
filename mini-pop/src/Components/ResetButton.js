import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ResetButton = (props) => {
  return (
    <div className="resetButton" onClick={props.onReset}>
      <span>
        <FontAwesomeIcon icon="recycle" />
      </span>
    </div>
  );
};

export default ResetButton;
