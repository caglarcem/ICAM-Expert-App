import fs from 'fs';
import { AudioConfig, ResultReason, SpeechConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

const convertSpeechToText = async (audioFilePath: string): Promise<string> => {
  const subscriptionKey = 'YOUR_AZURE_SUBSCRIPTION_KEY';
  const serviceRegion = 'YOUR_SERVICE_REGION'; // e.g., 'eastus'

  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  const audioConfig = AudioConfig.fromWavFileInput(fs.readFileSync(audioFilePath));

  const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(result => {
      if (result.reason === ResultReason.RecognizedSpeech) {
        resolve(result.text);
      } else {
        reject(new Error(`Speech recognition failed: ${result.errorDetails}`));
      }
    });
  });
};

export default convertSpeechToText;

// Example usage
// convertSpeechToText('path/to/your/audio/file.wav')
//   .then(text => console.log(`Recognized text: ${text}`))
//   .catch(err => console.error(`Error: ${err.message}`));
