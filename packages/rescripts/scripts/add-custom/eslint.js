const {existsInRoot, rootPath} = require('../../utilities')

module.exports = config => {
	const newConfig = {...config}
	const eslintOptions = config.module.rules[1].use[0].options

	const clearESLintConfig = () => {
		eslintOptions.baseConfig = {}
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

	return newConfig
}
