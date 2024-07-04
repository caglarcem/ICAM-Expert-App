import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath.path);

const convertVideoToAudio = (inputFilePath: string, outputAudioTypeExt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputFilePath = path.format({
      ...path.parse(inputFilePath),
      base: undefined, // remove the base so it uses name and ext
      ext: outputAudioTypeExt,
    });

    ffmpeg(inputFilePath)
      .output(outputFilePath)
      .on('end', () => {
        console.log(`Conversion finished: ${outputFilePath}`);
        resolve(outputFilePath);
      })
      .on('error', err => {
        console.error(`Error: ${err.message}`);
        reject(err);
      })
      .run();
  });
};

export default convertVideoToAudio;

// Example usage:
// ConvertVideoToAudio.convert('path/to/your/video/file.mp4')
//   .then(output => console.log(`Audio file saved at: ${output}`))
//   .catch(err => console.error(`Conversion failed: ${err.message}`));
