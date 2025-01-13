import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import './WordByWordDisplay.css';

const WordByWordDisplay = ({ pages, currentPage, handlePageChange }) => {
  const currentText = pages.pages[currentPage - 1]?.text || "";
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [WordsPerMinute, setWordsPerMinute] = useState(100);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [marks, setMarks] = useState([]);
  const words = currentText.split(" ");

  const punctuationTimers = {
    ",": 1.50,
    ".": 2.0,
    ";": 1.75,
    "?": 2.0,
    "!": 2.0,
    ":": 1.5,
    "—": 2.0,
    "...": 2.5
  };


  useEffect(() => {
    setCurrentWordIndex(0);
    generateMarks();
  }, [currentText]);



  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);



  // Dealing with automatical change of pages
  useEffect(() => {
    if (isPaused) return;
    // Empty page case
    if (words.length === 0) {
      setTimeout(() => {
        handlePageChange(currentPage + 1);
      }, 4000);
    // Last page
    } else if (currentWordIndex === words.length - 1 && autoAdvance) {
      setTimeout(() => {
        handlePageChange(currentPage + 1);
      }, calculateInterval(WordsPerMinute, words[currentWordIndex]));
    }
  }, [currentWordIndex, autoAdvance, currentPage, words.length, WordsPerMinute, isPaused]);

  // Word-By-Word Display
  useEffect(() => {
    if (isPaused || currentWordIndex >= words.length) return;

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev + 1 >= words.length) {
          clearInterval(interval);
          return words.length - 1;
        }
        return prev + 1;
      });
    }, calculateInterval(WordsPerMinute, words[currentWordIndex] || ""));

    return () => clearInterval(interval);
  }, [WordsPerMinute, currentWordIndex, isPaused, words]);


  function calculateInterval(WordsPerMinute, word) {
    const punctuation = Object.keys(punctuationTimers).find(punc => word.includes(punc));
    const baseInterval = (60 / WordsPerMinute) * 1000;
    if (!punctuation) {
      return baseInterval;
    }
    return baseInterval * punctuationTimers[punctuation];
  }

  const generateMarks = () => {
    const sentenceStartIndices = [];
    words.forEach((word, index) => {
      if (index === 0 || /[.!?]/.test(words[index - 1])) {
        const punctuation = words[index - 1]?.match(/[.!?]/)?.[0] || ''; // Extract punctuation
        sentenceStartIndices.push({ value: index, label: punctuation });
      }
    });
    setMarks(sentenceStartIndices);
  };

  const handleSliderChange = (_, newValue) => {
    setWordsPerMinute(newValue);
  };

  const progressChangeHandler = (_, newValue) => {
    setCurrentWordIndex(newValue);
  };

  return (
    <div>
      <div className="switch-div">
        <Switch
          defaultChecked
          id="autoAdvanceSwitch"
          className="ms-auto"
          color="warning"
          onChange={(e) => setAutoAdvance(e.target.checked)}
        />
        <label className="switch-label" htmlFor="autoAdvanceSwitch">
          {autoAdvance
            ? "Automatic Page Change Enabled"
            : "Enable Automatic Page Change"}
        </label>
      </div>
      <div className="sliderContainer">
        <Box sx={{ width: '90%' }}>
          <Slider
            color="warning"
            className="customSlider"
            value={WordsPerMinute}
            marks={[
              { value: 100, label: '100 WPM' },
              { value: 400, label: '400 WPM' },
            ]}
            onChange={handleSliderChange}
            aria-labelledby="words-per-minute-slider"
            step={50}
            min={100}
            max={400}
            valueLabelDisplay="auto"
          />
        </Box>
      </div>
      <div className="words mb-5">
        <h1 className="display-2">{words[currentWordIndex]}</h1>
      </div>
      <div className="controllers">
        <button
          className="controlButton"
          onClick={() => setIsPaused((prev) => !prev)}
        >
          {isPaused ? (
            <span className="buttonIcon ms-3">▶</span>
          ) : (
            <span className="buttonIcon">⏸</span>
          )}
        </button>
      </div>
      <div className="d-flex justify-content-center mt-5">
        <Slider
          className="progress-slider"
          color="warning"
          marks={marks}
          size="lg"
          valueLabelDisplay="auto"
          variant="soft"
          min={0}
          max={Math.max(0, words.length - 1)} // Prevent negative max
          value={Math.min(currentWordIndex, words.length - 1)}
          onChange={(_, newValue) => progressChangeHandler(_, newValue)}
        />
      </div>
    </div>
  );

};

export default WordByWordDisplay;
