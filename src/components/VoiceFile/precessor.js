import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import StringSimilarity from "string-similarity";
import swal from "@sweetalert/with-react";

const unKnownSwal = (shortScore) => {
  return swal(
    <div>
      <h5>Are you lookig for</h5>
      {shortScore?.slice(0, 6).map((val, index) => {
        if (val?.nav) {
          return (
            <div
              className="ms-2 me-auto"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
                border: "1px solid #b5b5b591",
              }}
              key={index}
            >
              <div className="fw-bold">{val?.page}</div>
              <a href={val?.nav}>
                <small style={{ color: "#1976d2", cursor: "pointer" }}>
                  {window.location.origin} {val?.nav}
                </small>
              </a>
            </div>
          );
        }
      })}
    </div>
  );
};

export const VoiceProcessing = (props) => {
  const { TrainingData, history } = props;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const navigateToPage = (nav) => {
    if (history) {
      history(nav);
    } else {
      window.location.replace(nav);
    }
  };

  const processingEngine = debounce(function (transcript) {
    const search = TrainingData?.map((data) => {
      return {
        nav: data?.nav,
        score: StringSimilarity.compareTwoStrings(data?.text, transcript),
        page: data?.page,
      };
    });

    const shortScore = search.sort(function (a, b) {
      return b?.score - a?.score;
    });

    if (shortScore[0]?.score > 0) {
      resetTranscript();

      if (shortScore[0].score > 0.45) {
        navigateToPage(shortScore[0]?.nav);

        return;
      } else {
        unKnownSwal(shortScore);
        return;
      }
    } else {
      return shortScore;
    }
  }, 2000);

  if (transcript && !listening) {
    processingEngine(transcript);
  }

  return {
    SpeechRecognition,
    browserSupportsSpeechRecognition,
    transcript,
    listening,
  };
};

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
    if (callNow) func.apply(context, args);
  };
}
