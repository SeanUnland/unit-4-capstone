import React from "react";
import PlayButton from "./PlayButton";
import TimeSignature from "./TimeSignature";
import ResetButton from "./ResetButton";
import TapTempo from "./TapTempo";
import DisplayTempo from "./DisplayTempo";
import Tempo from "./Tempo";
import * as Tone from "tone";
import { Time } from "tone";

const Transport = (props) => {
  return (
    <div className="transportButtons">
      <div className="topButtons">
        <PlayButton
          isPlaying={props.isPlaying}
          onTogglePlay={props.onTogglePlay}
        />
        <TimeSignature
          sequenceLength={props.sequenceLength}
          onLengthChange={props.onLengthChange}
        />
        <ResetButton onReset={props.onReset} />
      </div>
      <div className="bottomButtons">
        <TapTempo handleTap={props.handleTap} />
        <DisplayTempo tempo={props.tempo} />
        <Tempo tempo={props.tempo} onTempoChange={props.onTempoChange} />
      </div>
    </div>
  );
};

export default Transport;
