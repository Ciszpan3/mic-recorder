import React from "react";

import { Recorder, AudioRecorder } from "./components";

import "../src/css/style.css";
import Rec from "./components/Rec";

function App() {
  return (
    <div className="main">
      <Recorder />

      {/* <AudioRecorder/>
      <Rec/> */}
    </div>
  );
}

export default App;
