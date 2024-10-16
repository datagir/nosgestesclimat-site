export const NETLIFY_FUNCTIONS_URL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:8888/.netlify/functions'
		: '/.netlify/functions'

export const secure = process.env.NODE_ENV === 'development' ? '' : 's'
const protocol = `http${secure}://`

export const SERVER_URL = protocol + 'server.nosgestesclimat.fr'

export const SURVEYS_URL = SERVER_URL + '/surveys/'

export const GROUP_URL =
	(process.env.NODE_ENV === 'development'
		? 'http://localhost:3000'
		: SERVER_URL) + '/group'
