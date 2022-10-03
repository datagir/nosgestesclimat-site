/*
	Calls the DeepL API to translate the JSON release files.

	Command: yarn translate:release [options]
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const yargs = require('yargs')
const stringify = require('json-stable-stringify')

const utils = require('./utils')
const cli = require('./cli')

const { srcLang, destLangs } = cli.getArgs(
	`Calls the DeepL API to translate the JSON release files.`
)

const srcPath = `source/locales/releases/releases-${srcLang}.json`

const progressBar = new cliProgress.SingleBar(
	{
		stopOnComplete: true,
		clearOnComplete: true,
		forceRedraw: true,
		format: '{lang} | {value}/{total} | {bar} | {msg} ',
	},
	cliProgress.Presets.shades_grey
)

const translateTo = async (srcJSON, destPath, destLang) => {
	const tradJSON = []
	await Promise.all(
		srcJSON.map(async (release) => {
			progressBar.update(progressBar.value, {
				msg: `Translating '${release.name}'...`,
				lang: destLang,
			})
			const translation = await utils.fetchTranslation(
				release.body,
				srcLang.toUpperCase(),
				destLang.toUpperCase()
			)
			release.body = translation
			tradJSON.push(release)
			progressBar.increment()
		})
	)
	fs.writeFileSync(
		destPath,
		stringify(tradJSON, {
			cmp: (a, b) => a.key.localeCompare(b.key),
			space: 2,
		}),
		{ flag: 'w' }
	)
}

const srcJSON = JSON.parse(fs.readFileSync(srcPath, 'utf8'))

progressBar.start(destLangs.length * srcJSON.length, 0)
destLangs.forEach((destLang) => {
	const destPath = `source/locales/releases/releases-${destLang}.json`
	translateTo(srcJSON, destPath, destLang)
})