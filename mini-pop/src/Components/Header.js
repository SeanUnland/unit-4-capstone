import React from "react";
import _ from "lodash";
import * as Tone from "tone";

const Header = (props) => {
  return (
    <div className={_.chain([props.landscape]).compact().join("").value()}>
      Mini Pops
    </div>
  );
};

export default Header;
