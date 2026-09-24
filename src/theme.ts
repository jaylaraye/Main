export const INK = '#0b0706';
export const PARCHMENT = '#f3e6cf';

export type BookTheme = {
	numeral: string;
	title: string;
	year: string;
	glyph: string;
	glyphMeaning: string;
	accent: string;
	glow: string;
	bg: string;
	lines: string[];
};

// Spoiler-light summaries written for this piece.
export const BOOKS: BookTheme[] = [
	{
		numeral: 'Book I',
		title: 'The Poppy War',
		year: '2018',
		glyph: '凤',
		glyphMeaning: 'The Phoenix',
		accent: '#e0402f',
		glow: '#ff7a3d',
		bg: '#2a0707',
		lines: [
			'A war orphan from Tikany cheats fate and aces the Keju.',
			'At Sinegard Academy, she learns the gods are real.',
			'And one of them is made of fire.',
		],
	},
	{
		numeral: 'Book II',
		title: 'The Dragon Republic',
		year: '2019',
		glyph: '龙',
		glyphMeaning: 'The Dragon',
		accent: '#3fa7b5',
		glow: '#7fe3f0',
		bg: '#04161c',
		lines: [
			'Haunted by what she has done, Rin sails for vengeance.',
			'A Dragon Warlord promises a republic.',
			'Every alliance has a price.',
		],
	},
	{
		numeral: 'Book III',
		title: 'The Burning God',
		year: '2020',
		glyph: '神',
		glyphMeaning: 'The God',
		accent: '#f0a830',
		glow: '#ffd36b',
		bg: '#1e0c02',
		lines: [
			'Rin returns to the south to lead a war of her own.',
			'Nikan is torn between empire, republic and the West.',
			'Some fires cannot be put out.',
		],
	},
];
