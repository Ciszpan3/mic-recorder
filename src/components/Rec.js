import React, { useState } from 'react';
import Recorder from 'recorder-js';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recorder, setRecorder] = useState(null);

  const startRecording = async () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const recorder = new Recorder(audioContext, {
      numChannels: 1,
    });
    await recorder.init();
    recorder.start();
    setRecording(true);
    setRecorder(recorder);
  };

  const stopRecording = async () => {
    const audioBlob = await recorder.stop();
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);
    setRecording(false);
  };

  const downloadAudio = () => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = audioUrl;
    a.download = 'recording.mp3';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(audioUrl);
    document.body.removeChild(a);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioUrl && (
        <div>
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <button onClick={downloadAudio}>Download MP3</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
