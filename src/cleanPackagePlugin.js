const through = require('through2');
const PluginError = require('plugin-error');

const PLUGIN_NAME = 'gulp-clean-package';

/**
 * Props to leave in package.json
 */
const defaultPublicProperties = [
	'name',
	'version',
	'description',
	'keywords',
	'author',
	'license',
	'bin',
	'bugs',
	'homepage',
	'repository',
	'dependencies',
	'peerDependencies',
	'engines',
];

/**
 * Plugin for clean package.json file
 */
module.exports = function (options = {}) {
	if (typeof options !== 'object') {
		throw new PluginError(PLUGIN_NAME, 'Options must be is object');
	}

	// Options
	const {
		/**
		 * New props. It will overwrite exists
		 */
		additionalProperties = {},

		/**
		 * This props will not remove
		 */
		publicProperties = [],

		/**
		 * This props will remove anyway
		 */
		propertiesToRemove = [],

		/**
		 * Disable default list of ignored props
		 */
		noUseDefaultProperties = false,

		/**
		 * Style of spaces for JSON result
		 */
		indentStyle = '\t',
	} = options;

	const propsToKeep = noUseDefaultProperties
		? publicProperties
		: [...defaultPublicProperties, ...publicProperties];

	const transformObject = (sourceObject) => {
		const newObject = { ...sourceObject };

		// Remove unnecessary props
		Object.keys(newObject).forEach((name) => {
			const shouldBeKeeps =
				propsToKeep.includes(name) && !propertiesToRemove.includes(name);

			if (!shouldBeKeeps) {
				delete newObject[name];
			}
		});

		// Add props
		return { ...newObject, ...additionalProperties };
	};

	return through.obj(function (file, encoding, callback) {
		// Skip
		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			// TODO: support streams
			// file.contents is a Stream - https://nodejs.org/api/stream.html
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));

			// or, if you can handle Streams:
			//file.contents = file.contents.pipe(...
			//return callback(null, file);
		} else if (file.isBuffer()) {
			const rawString = file.contents.toString('utf-8');
			const packageJson = JSON.parse(rawString);

			const transformedJson = transformObject(packageJson);

			const stringifyData = JSON.stringify(transformedJson, null, indentStyle);

			file.contents = Buffer.from(stringifyData);

			return callback(null, file);
		}
	});
};
