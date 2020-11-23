import React from "react";
import Sequence from "./Sequence";
import Pitch from "./Pitch";

const SequenceRow = (props) => {
  return (
    <div className="sequenceRow">
      <Pitch
        onPitchSelect={props.onPitchSelect}
        notes={props.notes}
        row={props.row}
      />
      <Sequence
        checked={props.checked}
        row={props.row}
        isActive={props.isActive}
        onToggle={props.onToggle}
      />
    </div>
  );
};

export default SequenceRow;
