import React from "react";
import DrumSequencer from "./Components/DrumSequencer";
import SampleLibrary from "./Components/SampleLibrary";
import Synth from "./Components/Synth";
import Transport from "./Components/Transport";
import Header from "./Components/DrumSequencer";
import { motion } from "framer-motion";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faStop,
  faRecycle,
  faInfoCircle,
} from "@fortawesome/fontawesome-svg-core";
import StarAudioContext from "startaudiocontext";
import * as Tone from "tone";
import "./App.css";
import StartAudioContext from "startaudiocontext";

function toggleBox(priorChecked, i, row) {
  const checked = [...priorChecked];
  checked[row][i] = !checked[row][i];
  return checked;
}

const synth = new Tone.PolySynth(2, Tone.Synth).toMaster();
const context = new AudioContext();

library.add(faPlay);
library.add(faStop);
library.add(faRecycle);
library.add(faInfoCircle);

class App extends React.PureComponent {
  state = {
    checked: [
      [true, true, false, false, false, false, false],
      [false, false, true, false, true, false, true],
    ],
    isPlaying: false,
    sequenceLength: 7,
    tempo: 90,
    maxTempo: 300,
    isActive: [
      [0, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0],
    ],
    renderedNotes: [],
    partContainer: [],
    notes: ["Eb5", "C5"],
    timeContainer: [],
    defaults: {
      tempo: 90,
      sequenceLength: 16,
      isPlaying: false,
      elapsedTime: 0,
      numberOfTaps: 0,
      averageBPM: 0,
      checked: [
        [
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
        [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
      ],
      notes: ["Eb5", "C5"],
      isActive: [
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      ],
    },
    landscape: false,
    velocity: 0.1,
  };

  componentDidMount = () => {
    this.generateMetronome();

    StartAudioContext(Tone.context);
    StartAudioContext(context);

    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 32 || e.keyCode === 13) {
        try {
          e.preventDefault();
          this.onTogglePlay();
        } catch (e) {
          console.log(e);
        }
      } else if (e.keyCode === 84) {
        try {
          e.preventDefault();
          this.handleTap();
        } catch (e) {
          console.log(e);
        }
      }
    });

    if (
      window.screen.orientation &&
      Math.abs(window.screen.orientation.angle) === 90 &&
      window.screen.height < 500
    )
      this.setState({ landscape: true });
    window.addEventListener("orientationchange", () => {
      if (Math.abs(window.screen.orientation.angle) !== 90) {
        this.setState({ landscape: false });
      } else if (window.screen.height < 500) {
        this.setState({ landscape: true });
      }
    });
  };

  onToggleBox = (i, row) => {
    this.setState(
      (prior) => ({
        checked: toggleBox(prior.checked, i, row),
      }),
      () => {
        this.generateMetronome();
      }
    );
  };

  onTogglePlay = () => {
    this.setState(
      (prior) => ({
        isPlaying: !prior.isPlaying,
      }),
      () => {
        if (!this.state.isPlaying) {
          Tone.Transport.stop();
          Tone.Transport.loop = false;
          Tone.Transport.loopEnd = 0;
          this.setState({ isActive: [[], []] }, () => console.log("stopped"));
        } else {
          Tone.Transport.loop = true;
          Tone.Transport.loopStart = 0;
          Tone.Transport.loopEnd =
            (this.state.sequenceLength * 30) / this.state.tempo;
          Tone.Transport.start("+0.0");
          console.log("playing");
        }
      }
    );
  };

  restartPlaying = () => {
    if (this.state.isPlaying) {
      this.setState({ isPlaying: this.state.isPlaying }, () => {
        Tone.Transport.stop();
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd =
          (this.state.sequenceLength * 30) / this.state.tempo;
        Tone.Transport.loop = true;
        Tone.Transport.start("+0.0");
        console.log("play restarted");
      });
    } else {
      console.log("restartPlaying called while not playing");
    }
  };

  onLengthChange = (sequenceLength) => {
    const checked = [[], []];
    for (let i = 0; i < sequenceLength; i++) {
      checked[0].push(i === 0);
      checked[1].push(i !== 0 && i % 2 === 0);
    }
    this.setState(
      () => ({
        sequenceLength,
        checked,
      }),
      () => {
        Tone.Transport.loopEnd = (sequenceLength * 30) / this.state.tempo;
        this.generateMetronome();
      }
    );
  };

  onTempoChange = (tempo) => {
    this.setState(
      {
        tempo,
      },
      () => {
        Tone.Transport.bpm.value = tempo;
      }
    );
  };

  onReset = () => {
    this.setState(
      (prior) => ({
        tempo: prior.defaults.tempo,
        sequenceLength: prior.defaults.sequenceLength,
        isPlaying: prior.defaults.isPlaying,
        checked: prior.defaults.notes,
        isActive: prior.defaults.isActive,
      }),
      () => {
        this.resetTempo();
        this.forceStopr();
        this.onLengthChange(this.state.sequenceLength);
        this.onPitchSelect(this.state.notes[0], 0);
        this.onPitchSelect(this.state.notes[1], 1);
      }
    );
  };

  forceStop = () => {
    Tone.Transport.stop();
    Tone.Transport.loop = false;
    Tone.Transport.loopEnd = 0;
    console.log("stopped");
  };

  resetTempo = () => {
    Tone.Transport.bpm.value = this.state.defaults.tempo;
  };

  handleTap = () => {
    const timer = this.state.timer;
    if (timer.length > 2) timer.shift();
    timer.push(context.currentTime.toFixed(3));

    const tempo = Math.round(
      60 /
        (timer
          .slice(1)
          .map((time, i) => time - timer[i])
          .reduce((a, b) => a + b, 0) /
          (timer.length - 1))
    );

    if (tempo > 40 && tempo < 301) {
      this.setState({ tempo }, () => this.onTempoChange(tempo));
    } else if (tempo > 300) {
      this.setState({ tempo: this.state.maxTempo }, () =>
        this.onTempoChange(this.state.tempo)
      );
    }
  };

  onPitchSelect = (note, row) => {
    this.setState(
      {
        notes:
          row === "0"
            ? [note, this.state.notes[1]]
            : [this.states.notes[0], note],
      },
      () => {
        this.generateMetronome();
      }
    );
  };

  generateMetronome = () => {
    const parts = this.state.parts;
    parts.forEach((part) => part.removeAll());

    const [note1, note2] = this.state.notes,
      seqLength = this.state.sequenceLength,
      matrix = this.state.checked,
      velocity = this.state.velocity;

    const renderNotes = [];
    for (let i = 0; i < seqLength; i++) {
      const time = i / 2;
      if (matrix[0][i]) {
        renderNotes.push({
          note: note1,
          time: `0:${time}`,
          velocity: velocity,
          index: i,
        });
      } else if (!matrix[1][i]) {
        renderNotes.push({
          note: note1,
          time: `0:${time}`,
          velocity: 0,
          index: i,
        });
      }
      if (matrix[1][i]) {
        renderNotes.push({
          note: note2,
          time: `0:${time}`,
          velocity: velocity,
          index: i,
        });
      }
    }

    const part = new Tone.Part((time, value) => {
      this.triggerVisualize(value.index);
      synth.triggerAttackRelease(value.note, 0.05, time, value.velocity);
    }, renderNotes).start(0);
    parts.push(part);

    this.setState({
      renderNotes,
      parts,
    });
  };

  triggerVisualize = (index) => {
    const length = this.setState.sequenceLength;
    const isActive = [_.fill(Array(length), 0), _.fill(Array(length), 0)];

    isActive[0][index] = 1;
    isActive[1][index] = 1;
    this.setState({ isActive });
  };

  render() {
    return (
      <div className="App">
        <header className="header">
          <Header landscape={this.state.landscape} />
          <Transport
            isPlaying={this.state.isPlaying}
            onTogglePlay={this.onTogglePlay}
            sequenceLength={this.state.sequenceLength}
            onLengthChange={this.onLengthChange}
            tempo={this.state.tempo}
            onTempoChange={this.onTempoChange}
            onReset={this.onReset}
            handleTap={this.handleTap}
          />

          <DrumSequencer
            checked={this.state.checked}
            onToggle={this.onToggleBox}
            sequenceLength={this.state.sequenceLength}
            onPitchSelect={this.onPitchSelect}
            notes={this.state.notes}
            isActive={this.state.isActive}
          />
        </header>
      </div>
    );
  }

  // return(

  //   <div className="App">
  //     <DrumSequencer />
  //     <SampleLibrary />
  //     <Synth />
  //   </div>

  // );
}

export default App;
