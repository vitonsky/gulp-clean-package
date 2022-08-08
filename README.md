Gulp plugin to clean a `package.json` files.

It's remove unnecessary properties, configurable, ready to use out of the box.

# Installation

Install it as development dependency

`npm install -D gulp-clean-package`

# Usage

```js
const cleanPackage = require('gulp-clean-package');
 
gulp.task('scripts', function() {
  return gulp.src('./package.json')
    .pipe(cleanPackage())
    .pipe(gulp.dest('./dist'));
});
```

This will remove unnecessary properties from `package.json`:

### Input:
```json
{
	"name": "gulp-clean-package",
	"version": "0.0.1",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/vitonsky/gulp-clean-package.git"
	},
	"keywords": [],
	"license": "Apache-2.0",
	"bugs": {
		"url": "https://github.com/vitonsky/gulp-clean-package/issues"
	},
	"homepage": "https://github.com/vitonsky/gulp-clean-package#readme",
	"scripts": {
		// ...
	},
	"devDependencies": {
		// ...
	},
	"dependencies": {
		"plugin-error": "^2.0.0",
		"through2": "^4.0.2"
	},
	"eslint": {
		// ...
	},
	"foo": {
		// ...
	},
	"bar": 42,
}
```

### Output:
```json
{
	"name": "gulp-clean-package",
	"version": "0.0.1",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/vitonsky/gulp-clean-package.git"
	},
	"keywords": [],
	"license": "Apache-2.0",
	"bugs": {
		"url": "https://github.com/vitonsky/gulp-clean-package/issues"
	},
	"homepage": "https://github.com/vitonsky/gulp-clean-package#readme",
	"dependencies": {
		"plugin-error": "^2.0.0",
		"through2": "^4.0.2"
	}
}
```

# Options

```js
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
```

Example for input above with config:

```js
const cleanPackage = require('gulp-clean-package');
 
gulp.task('scripts', function() {
  return gulp.src('./package.json')
    .pipe(cleanPackage({
		publicProperties: ['foo'],
		propertiesToRemove: ['repository'],
		additionalProperties: {
			name: 'newName',
			baz: 123,
		}
	}))
    .pipe(gulp.dest('./dist'));
});
```


Output:
```json
{
	"name": "newName",
	"version": "0.0.1",
	"keywords": [],
	"license": "Apache-2.0",
	"bugs": {
		"url": "https://github.com/vitonsky/gulp-clean-package/issues"
	},
	"homepage": "https://github.com/vitonsky/gulp-clean-package#readme",
	"dependencies": {
		"plugin-error": "^2.0.0",
		"through2": "^4.0.2"
	},
	"foo": {
		// ...
	},
	"baz": 123
}
```