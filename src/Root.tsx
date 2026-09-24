import {Composition} from 'remotion';
import {PoppyWar, TOTAL_DURATION} from './PoppyWar';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="PoppyWar"
			component={PoppyWar}
			durationInFrames={TOTAL_DURATION}
			fps={30}
			width={1920}
			height={1080}
		/>
	);
};
