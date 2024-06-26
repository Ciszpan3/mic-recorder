import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Web Speech API is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript((prevTranscript) => prevTranscript + event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      console.log('Interim transcript:', interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsRecording(false);
    };

    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleClear = () => {
    setTranscript("")
  }

  return (
    <div>
      <button onClick={handleClear} className='recorder__clear-button'>
        Clear
      </button>
      <button onClick={startRecording} disabled={isRecording} className='recorder__start' style={{margin: "0 1.5rem"}}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording} className='recorder__stop'>
        Stop Recording
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default AudioRecorder;
