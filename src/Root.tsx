import {Composition} from 'remotion';
import {NETFLIX_DURATION, NetflixHouse} from './NetflixHouse';
import {PoppyWar, TOTAL_DURATION} from './PoppyWar';

export const RemotionRoot: React.FC = () => {
	return (
		<>
		<Composition
			id="PoppyWar"
			component={PoppyWar}
			durationInFrames={TOTAL_DURATION}
			fps={30}
			width={1920}
			height={1080}
		/>
		<Composition
			id="NetflixHouse"
			component={NetflixHouse}
			durationInFrames={NETFLIX_DURATION}
			fps={30}
			width={1080}
			height={1920}
		/>
		</>
	);
};
