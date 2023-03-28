import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const Visualizer: React.FC<TProps> = (props) => {
  const { audio, backgroundColor } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const audioData = useAudioData(audio);
  if (audioData == null) {
    return null;
  }

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 256,
  });

  return (
    <div>
      {visualization.map((v) => {
        return (
          <div
            style={{
              width: 2000 * v,
              height: 25,
              backgroundColor: backgroundColor,
            }}
          />
        );
      })}
    </div>
  );
};

export default Visualizer;

type TProps = {
  audio: string;
  backgroundColor: string;
};
