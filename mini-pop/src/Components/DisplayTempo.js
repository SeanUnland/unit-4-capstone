import React from "react";

const DisplayTempo = (props) => {
  return (
    <div className="tempoDisplay">
      <span>{props.tempo}</span>
    </div>
  );
};

export default DisplayTempo;
