import React from "react";

const Tempo = (props) => {
  return (
    <div className="tempoSlider">
      <input
        type="range"
        min="30"
        max="300"
        value={props.tempo}
        onChange={(e) => {
          props.onTempoChange(e.target.value);
        }}
      />
    </div>
  );
};

export default Tempo;
