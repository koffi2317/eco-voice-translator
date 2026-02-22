

function createSpeechRecognition(lang: string = "fr-FR") {
  const SpeechRecognitionApi =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionApi) {
    return null;
  }

  const recognition = new SpeechRecognitionApi();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;

  return recognition;
}

export default createSpeechRecognition;
