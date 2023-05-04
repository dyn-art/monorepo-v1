import { A3Canvas } from '../../components';

const ThumbnailV1: React.FC<TProps> = (props) => {
  const { imageUrl } = props;
  return (
    <div className="flex items-center justify-center w-full h-full">
      <A3Canvas scale={0.5} />
    </div>
  );
};

export default ThumbnailV1;

type TProps = {
  imageUrl: string;
};
