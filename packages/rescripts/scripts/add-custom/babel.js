const {existsInRoot, rootPath} = require('../../utilities')

module.exports = config => {
	const newConfig = {...config}
	const babelOptions = config.module.rules[2].oneOf[1].options

	const clearBabelConfig = () => {
		delete babelOptions.presets
		delete babelOptions.plugins
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

	return newConfig
}
