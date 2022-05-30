import React from "react";
import { useNavigate } from "react-router-dom";
import TrainingData from "./TrainingData.json";
import { VoiceProcessing } from "./precessor";
import Mic from "./asset/mic.png";
import CampaignIcon from "./asset/listen.png";

const VoiceFile = () => {
  let history = useNavigate();

  const {
    SpeechRecognition,
    browserSupportsSpeechRecognition,
    transcript,
    listening,
  } = VoiceProcessing({ TrainingData, history });

  if (!browserSupportsSpeechRecognition) {
    return <span></span>;
  }

  return (
    <>
      <h5 style={{ marginRight: 10 }}>{transcript}</h5>
      <div
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={SpeechRecognition.startListening}
      >
        {!listening ? (
          <img src={Mic} alt="mic" style={{ height: 30 }} />
        ) : (
          <img src={CampaignIcon} alt="mic" style={{ height: 30 }} />
        )}
      </div>
    </>
  );
};
export default VoiceFile;
