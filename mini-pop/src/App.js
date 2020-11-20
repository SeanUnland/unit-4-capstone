import React from "react";
import DrumSequencer from "./Components/DrumSequencer";
import SampleLibrary from "./Components/SampleLibrary";
import Synth from "./Components/Synth";
import { motion } from "framer-motion";
import * as Tone from "tone";
import "./App.css";

function App() {
  return (
    <div className="App">
      <DrumSequencer />
      <SampleLibrary />
      <Synth />
    </div>
  );
}

export default App;
