import React, { useState } from 'react';

import MicRecorder from 'mic-recorder-to-mp3';
import lamejs from 'lamejs';
import Timer from './Timer';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

// import { ReactMic } from 'react-mic';

const Recorder = () => {

  const [voice, setVoice] = useState(false)
  const [blobURL, setBlobURL] = useState('');
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState(0)

  const handleStart = () => {
    setElapsedTime(0)

    setBlobURL("")
    Mp3Recorder.start()
      .then(() => {
        setVoice(true)
        setIsRunning(true)
        setStartTime(Date.now());
      })
      .catch((e) => console.error(e));
  }
  const handleStop = () => {
    setIsRunning(false);
    setVoice(false)
    Mp3Recorder.stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        const file = new File(buffer, 'audio.mp3', {
          type: blob.type,
          lastModified: Date.now()
        })
        let baseAudio = await audioToBase64(file)
        console.log(baseAudio)
        setBlobURL(blobURL);
      })
      .catch((e) => console.error(e));
  }

  const audioToBase64 = async(audioFile) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(audioFile)
    })
  }

  const saveRecording = () => {
    if (!blobURL) return;

    fetch(blobURL)
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
      // Dekodowanie danych audio do PCM
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return audioContext.decodeAudioData(buffer);
    })
    .then((audioBuffer) => {
      // Konwersja do formatu MP3 przy użyciu lamejs
      const samples = audioBuffer.getChannelData(0); // Pobierz dane dla jednego kanału (mono)
      const mp3encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128); // mono 128kbps
      const blockSize = 1152; // Lamejs wymaga wielkości bloku 1152
      let mp3Data = [];

      for (let i = 0; i < samples.length; i += blockSize) {
        const sampleChunk = samples.subarray(i, i + blockSize);
        const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(new Int8Array(mp3buf));
        }
      }

      const mp3buf = mp3encoder.flush();   // końcowy krok kodowania mp3
      if (mp3buf.length > 0) {
        mp3Data.push(new Int8Array(mp3buf));
      }

      // Zapisz dane do pliku MP3
      const blob = new Blob(mp3Data, { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recorded.mp3';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((e) => console.error(e));
  };

  const handleClear = () => {
    setBlobURL('')
    setIsRunning(false)
    setElapsedTime(0)
    setVoice(false)
  }


  return ( 
    <div className='recorder'>
      MicRecorder
      <Timer elapsedTime={elapsedTime} startTime={startTime} isRunning={isRunning}/>
      <div className="recorder__content">
        <div className='recorder__clear'>
          <button onClick={handleClear} className='recorder__clear-button'>Clear</button>
        </div>
        <div className='recorder__buttons'>
          {!voice ? <button onClick={handleStart} className='recorder__start'>Start</button> :
          <button onClick={handleStop} className='recorder__stop'>Stop</button>}
        </div>
      </div>
      {/* <ReactMic
        record={voice}
        onStop={() => console.log(e)}
      /> */}
      <div className='recorder__audio'>
      {blobURL && (
          <audio controls>
            <source src={blobURL} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
      )}
      </div>
      {/* {blobURL && (
        <div>
          <button onClick={saveRecording}>Save as mp3</button>
        </div>
      )} */}
    </div>
  );
}
 
export default Recorder;