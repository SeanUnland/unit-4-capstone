import React from "react";

const TapTempo = (props) => {
  return (
    <div className="tapTempoButton" onClick={props.handleTap}>
      <span>Tap Tempo</span>
    </div>
  );
};

export default TapTempo;
