import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// Fades its children in at the start and out at the end of the parent Sequence.
export const Fade: React.FC<{children: React.ReactNode; duration?: number}> = ({
	children,
	duration = 18,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const opacity = interpolate(
		frame,
		[0, duration, durationInFrames - duration, durationInFrames],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};
