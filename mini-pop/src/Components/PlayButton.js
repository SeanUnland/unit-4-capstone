import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PlayButton = (props) => {
  return (
    <div className="playButton" onClick={props.onTogglePlay}>
      <span>
        {props.isPlaying ? (
          <FontAwesomeIcon icon="stop" />
        ) : (
          <FontAwesomeIcon icon="play" />
        )}
      </span>
    </div>
  );
};

export default PlayButton;
