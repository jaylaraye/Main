import {AbsoluteFill, Sequence} from 'remotion';
import {Fade} from './components/Fade';
import {BookScene} from './scenes/BookScene';
import {FinaleScene} from './scenes/FinaleScene';
import {TitleScene} from './scenes/TitleScene';
import {BOOKS, INK} from './theme';

const TITLE = 180;
const BOOK = 270;
const FINALE = 240;
const OVERLAP = 18;

export const TOTAL_DURATION = TITLE + BOOK * BOOKS.length + FINALE - OVERLAP * (BOOKS.length + 1);

export const PoppyWar: React.FC = () => {
	let cursor = 0;
	const at = (duration: number) => {
		const from = cursor;
		cursor += duration - OVERLAP;
		return from;
	};

	return (
		<AbsoluteFill style={{backgroundColor: INK}}>
			<Sequence from={at(TITLE)} durationInFrames={TITLE} name="Title">
				<Fade>
					<TitleScene />
				</Fade>
			</Sequence>
			{BOOKS.map((book, i) => (
				<Sequence key={book.title} from={at(BOOK)} durationInFrames={BOOK} name={book.title}>
					<Fade>
						<BookScene book={book} index={i} />
					</Fade>
				</Sequence>
			))}
			<Sequence from={at(FINALE)} durationInFrames={FINALE} name="Finale">
				<Fade duration={24}>
					<FinaleScene />
				</Fade>
			</Sequence>
		</AbsoluteFill>
	);
};
