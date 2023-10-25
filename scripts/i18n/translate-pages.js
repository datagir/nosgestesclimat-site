/*
	Calls the DeepL API to translate the Markdown files.

	Command: yarn translate:md [options]
*/

const fs = require('fs')
const glob = require('glob')

const utils = require('@incubateur-ademe/nosgestesclimat-scripts/utils')
const deepl = require('@incubateur-ademe/nosgestesclimat-scripts/deepl')
const cli = require('@incubateur-ademe/nosgestesclimat-scripts/cli')

const { srcLang, destLangs, srcFile, force } = cli.getArgs(
	'Calls the DeepL API to translate the Markdown files.',
	{
		file: true,
		source: true,
		force: true,
		target: true,
		defaultSrcFiles: '*.md',
	}
)

const translateTo = async (src, destPath, destLang) => {
	console.log(`Translating to ${cli.yellow(destPath)}...`)
	const translation = await deepl.fetchTranslationMarkdown(
		src,
		srcLang.toUpperCase(),
		destLang.toUpperCase()
	)
	fs.writeFileSync(destPath, translation, 'utf8', { flag: 'w' })
}

console.log(
	`Translating Markdown files from ${cli.yellow(
		`source/locales/pages/${srcLang}/${srcFile}`
	)}...`
)
glob(`source/locales/pages/${srcLang}/${srcFile}`, (err, files) => {
	cli.exitIfError(err, 'ERROR: an error occured while fetching the files:')
	console.log(
		`Found ${cli.withStyle(
			cli.colors.fgGreen,
			files.length
		)} files to translate.`
	)

	files.forEach((file) => {
		const src = fs.readFileSync(file, 'utf8')
		destLangs.forEach((destLang) => {
			const destPath = file.replace(srcLang, destLang)
			if (!fs.existsSync(destPath) || force) {
				translateTo(src, destPath, destLang)
			} else {
				console.log(
					`The file ${cli.yellow(destPath)} already exists, ${cli.yellow(
						'skipping'
					)}... (use the -f to force the translation)`
				)
			}
		})
	})
})
