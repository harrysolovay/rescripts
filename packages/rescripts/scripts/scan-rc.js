const {rootPath, existsInRoot, reactScriptsPath} = require('./utilities')

const [configScriptEnding, command] = (() => {
	switch (process.env.NODE_ENV) {
		case 'development':
			return ['dev', 'start']
		case 'production':
			return ['prod', 'build']
		default: {
			console.error(
				'Cannot detect environment. Please file an issue on the Rescripts GitHub.',
			)
			process.exit(1)
		}
	}
})()

const configPath = `${reactScriptsPath}/config/webpack.config.${configScriptEnding}`
const config = require(configPath)

const babelOptions = config.module.rules[2].oneOf[1].options
const eslintOptions = config.module.rules[1].use[0].options

const clearBabelConfig = () => {
	delete babelOptions.presets
	delete babelOptions.plugins
}

const clearESLintConfig = () => {
	eslintOptions.baseConfig = {}
}

for (let fileName of ['.babelrc', '.babelrc.js', 'babel.config.js']) {
	if (existsInRoot(fileName)) {
		switch (fileName) {
			case '.babelrc': {
				clearBabelConfig()
				babelOptions.babelrc = true
				break
			}
			case '.babelrc.js':
			case 'babel.config.js': {
				clearBabelConfig()
				Object.assign(babelOptions, require(`${rootPath}/${fileName}`))
				break
			}
			default: {
				break
			}
		}
	}
}

for (let fileName of ['.eslintrc', '.eslintrc.js', 'eslint.config.js']) {
	if (existsInRoot(fileName)) {
		switch (fileName) {
			case '.eslintrc': {
				clearESLintConfig()
				eslintOptions.useEslintrc = true
				break
			}
			case '.eslintrc.js':
			case 'eslint.config.js': {
				clearESLintConfig()
				eslintOptions.baseConfig = require(`${rootPath}/${fileName}`)
				break
			}
			default: {
				break
			}
		}
	}
}

require.cache[require.resolve(configPath)].exports = config
require(`${reactScriptsPath}/scripts/${command}`)
