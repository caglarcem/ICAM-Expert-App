import { SpeechClient, protos } from '@google-cloud/speech';
import { Storage } from '@google-cloud/storage';
import { exec } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import {
  AudioConfig,
  CancellationReason,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import path from 'path';

// Set the ffmpeg path for fluent-ffmpeg
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  throw new Error('ffmpeg path is not available');
}

// Function to trim silence from the beginning and end of the audio
const trimSilence = (inputFilePath: string, outputFilePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const command = `${ffmpegPath} -i "${inputFilePath}" -af silenceremove=1:0:-50dB "${outputFilePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error trimming silence: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`ffmpeg stderr: ${stderr}`);
      }
      resolve();
    });
  });
};

// Function to enhance and resample audio quality
const enhanceAudioAdvanced = (inputFilePath: string, outputFilePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .audioFilters([
        'afftdn=nf=-25', // Apply frequency domain noise reduction
        'highpass=f=200', // High-pass filter
        'lowpass=f=3000', // Low-pass filter
        'volume=1.5', // Increase volume
        'dynaudnorm=g=7', // Dynamic audio normalization
      ])
      .audioFrequency(16000) // Resample to 16000 Hz
      .audioChannels(1) // Convert to mono
      .on('end', () => {
        console.log('Advanced audio enhancement complete');
        resolve();
      })
      .on('error', err => {
        console.error('Error during advanced audio enhancement:', err);
        reject(err);
      })
      .save(outputFilePath);
  });
};

const convertSpeechToTextWithAzure = async (audioFilePath: string): Promise<string> => {
  const subscriptionKey = process.env.AZURE_SPEECH_SERVICE_API_KEY;
  const serviceRegion = process.env.AZURE_SPEECH_SERVICE_REGION;

  if (!serviceRegion || !subscriptionKey) {
    throw new Error('Azure speech service endpoint URL or API key must be configured.');
  }

  if (!fs.existsSync(audioFilePath)) {
    throw new Error(`Audio file does not exist: ${audioFilePath}`);
  }

  // Define the paths for the trimmed and enhanced audio files
  const trimmedAudioFilePath = path.join(path.dirname(audioFilePath), 'trimmed_audio.wav');
  const enhancedAudioFilePath = path.join(path.dirname(trimmedAudioFilePath), 'enhanced_audio.wav');

  // Trim silence from the audio file
  await trimSilence(audioFilePath, trimmedAudioFilePath);

  // Enhance the audio quality before processing
  await enhanceAudioAdvanced(trimmedAudioFilePath, enhancedAudioFilePath);

  // Read the enhanced audio file
  const audioBuffer = fs.readFileSync(enhancedAudioFilePath);

  // Configure the speech service
  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  const audioConfig = AudioConfig.fromWavFileInput(audioBuffer);

  const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    let allText = '';

    recognizer.recognizing = (s, e) => {
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
        allText += e.result.text + ' ';
      } else if (e.result.reason === ResultReason.NoMatch) {
        console.log('No speech could be recognized.');
      }
    };

    recognizer.canceled = (s, e) => {
      console.error(`CANCELED: Reason=${e.reason}`);

      if (e.reason === CancellationReason.Error) {
        console.error(`ErrorDetails=${e.errorDetails}`);
      }

      recognizer.stopContinuousRecognitionAsync(
        () => {
          reject(new Error('Speech recognition was canceled.'));
        },
        err => {
          reject(err);
        }
      );
    };

    recognizer.sessionStopped = (s, e) => {
      console.log('\nSession stopped event.');
      recognizer.stopContinuousRecognitionAsync(
        () => {
          resolve(allText.trim());
        },
        err => {
          reject(err);
        }
      );
    };

    recognizer.startContinuousRecognitionAsync(
      () => {
        console.log('Continuous recognition started.');
      },
      err => {
        reject(err);
      }
    );
  });
};

// Initialize the Google Cloud Speech client
const speechClient = new SpeechClient();

// Initialize the Google Cloud Storage client
const storage = new Storage();

// Function to upload a file to Google Cloud Storage
const uploadToGCS = async (bucketName: string, filePath: string, destination: string): Promise<string> => {
  await storage.bucket(bucketName).upload(filePath, {
    destination,
  });
  return `gs://${bucketName}/${destination}`;
};

/**
 * Deletes a file from the specified Google Cloud Storage bucket.
 *
 * @param {string} bucketName - The name of the GCS bucket.
 * @param {string} fileName - The name of the file to delete.
 */
async function deleteFromGCS(bucketName: string, fileName: string) {
  try {
    await storage.bucket(bucketName).file(fileName).delete();
    console.log(`gs://${bucketName}/${fileName} deleted.`);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

// Function to convert speech to text using Google Cloud Speech-to-Text
const convertSpeechToText = async (audioFilePath: string): Promise<string> => {
  console.log('Converting speech to text...');

  const bucketName = 'icam-audio-bucket';
  const gcsDestination = 'audio/enhanced_audio.wav';

  const enhancedAudioFilePath = path.join(path.dirname(audioFilePath), 'enhanced_audio.wav');

  // Enhance the audio quality before processing
  await enhanceAudioAdvanced(audioFilePath, enhancedAudioFilePath);

  console.log('Audio enhanced...');

  // Upload the enhanced audio file to Google Cloud Storage
  const gcsUri = await uploadToGCS(bucketName, enhancedAudioFilePath, gcsDestination);

  console.log('Audio file uploaded. URI: ', gcsUri);

  const request: protos.google.cloud.speech.v1.ILongRunningRecognizeRequest = {
    audio: {
      uri: gcsUri,
    },
    config: {
      encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
  };

  // Initiate a long-running recognize operation
  const [operation] = await speechClient.longRunningRecognize(request);

  // Wait for the operation to complete
  const [response] = await operation.promise();

  console.log('Response: ', response);

  await deleteFromGCS(bucketName, gcsDestination);

  if (!response?.results) {
    throw new Error('No response from the speech-to-text client.');
  }

  const transcription = response.results
    .map(result => {
      if (result.alternatives && result.alternatives.length > 0) {
        return result.alternatives[0].transcript;
      } else {
        return '';
      }
    })
    .filter(transcript => transcript !== '')
    .join('\n');

  console.log('Transcription:', transcription);
  return transcription;
};

export { convertSpeechToText, convertSpeechToTextWithAzure };
