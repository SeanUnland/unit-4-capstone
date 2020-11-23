import React, { useCallback, useState, useEffect } from "react";
import * as Tone from "tone";

// import PropTypes from "prop-types";

const synth = new Tone.Synth().toDestination();

synth.triggerAttackRelease("C4", "8n");

const DrumSequencer = (props) => {
  return <div>{synth}</div>;
};

export default DrumSequencer;
