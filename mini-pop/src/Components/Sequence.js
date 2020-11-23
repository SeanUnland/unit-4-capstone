import React from "react";
import _ from "lodash";

const Sequence = (props) => {
  return (
    <div className="sequenceBox">
      {_.map(props.checked[props.row], (isBoxChecked, i) => (
        <div
          onClick={() => {
            props.onToggle(i, props.row);
          }}
          className={_.chain([
            isBoxChecked,
            props.isActive[props.row][i] && !isBoxChecked,
            props.isActive[props.row][i] && isBoxChecked,
          ])
            .compact()
            .join("")
            .value()}
          key={i}
        />
      ))}
    </div>
  );
};

export default Sequence;
