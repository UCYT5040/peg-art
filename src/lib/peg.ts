export const styles = ['rect', 'circle', 'triangle'];

export const colors = [
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose'
];

export interface PegConfig {
	style: typeof styles[number];
	color: typeof colors[number];
}
