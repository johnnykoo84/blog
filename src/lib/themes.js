/**
 * Theme palette definitions.
 * Each value is space-separated RGB channels (e.g. "0 0 128")
 * to match the existing CSS var format: rgb(var(--background)).
 */
export const themes = {
	hitel: {
		id: 'hitel',
		name: 'HiTel Classic',
		nameKr: 'PC통신',
		vars: {
			background: '0 0 128',
			foreground: '255 255 255',
			primary: '255 255 255',
			'primary-foreground': '0 0 128',
			accent: '200 200 255',
			muted: '150 150 200',
			border: '255 255 255',
			link: '255 255 255',
			'link-visited': '200 200 255'
		}
	},
	terminal: {
		id: 'terminal',
		name: 'Terminal Green',
		nameKr: '터미널',
		vars: {
			background: '0 0 0',
			foreground: '0 255 65',
			primary: '0 255 65',
			'primary-foreground': '0 0 0',
			accent: '0 200 50',
			muted: '0 150 40',
			border: '0 255 65',
			link: '0 255 65',
			'link-visited': '0 200 50'
		}
	},
	amber: {
		id: 'amber',
		name: 'Amber CRT',
		nameKr: '호박 모니터',
		vars: {
			background: '20 15 0',
			foreground: '255 176 0',
			primary: '255 176 0',
			'primary-foreground': '20 15 0',
			accent: '255 200 60',
			muted: '180 120 0',
			border: '255 176 0',
			link: '255 200 60',
			'link-visited': '200 140 0'
		}
	},
	dos: {
		id: 'dos',
		name: 'DOS',
		nameKr: 'DOS',
		vars: {
			background: '0 0 0',
			foreground: '192 192 192',
			primary: '255 255 255',
			'primary-foreground': '0 0 0',
			accent: '170 170 170',
			muted: '128 128 128',
			border: '192 192 192',
			link: '255 255 255',
			'link-visited': '170 170 170'
		}
	},
	chollian: {
		id: 'chollian',
		name: 'Chollian',
		nameKr: '천리안',
		vars: {
			background: '0 80 80',
			foreground: '255 255 0',
			primary: '255 255 0',
			'primary-foreground': '0 80 80',
			accent: '255 255 150',
			muted: '180 180 0',
			border: '255 255 0',
			link: '255 255 150',
			'link-visited': '200 200 0'
		}
	},
	ghostty: {
		id: 'ghostty',
		name: 'Ghostty',
		nameKr: 'Ghostty',
		vars: {
			background: '41 44 51',
			foreground: '255 255 255',
			primary: '136 161 187',
			'primary-foreground': '41 44 51',
			accent: '233 200 128',
			muted: '160 160 180',
			border: '80 85 95',
			link: '136 161 187',
			'link-visited': '183 189 115'
		}
	}
};

export const themeIds = Object.keys(themes);
