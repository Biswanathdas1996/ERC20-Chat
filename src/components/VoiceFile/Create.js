import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import _ from "lodash";
import { TextData } from "./FunctionalTexts";
import StringSimilarity from "string-similarity";
import { useNavigate } from "react-router-dom";

const VoiceFile = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  let history = useNavigate();
  useEffect(() => {
    const search = TextData?.map((data) => {
      return {
        nav: data?.nav,
        score: StringSimilarity.compareTwoStrings(data?.text, transcript),
      };
    });

    const shortScore = search.sort(function (a, b) {
      return b?.score - a?.score;
    });
    debounce_fun(shortScore[0]?.nav);
    console.log("====>", shortScore[0]?.nav);
  }, [transcript]);

  const debounce_fun = _.debounce(function (link) {
    if (transcript) {
      history(link);
    }

    // return;
  }, 2000);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      {/* <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
       <button onClick={resetTranscript}>Reset</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button> */}
      <p>{transcript}</p>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={SpeechRecognition.startListening}
      >
        <MicIcon />
      </IconButton>

      {/* <p>{transcript}</p> */}
    </>
  );
};
export default VoiceFile;
