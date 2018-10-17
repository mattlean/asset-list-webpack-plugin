[![npm](https://img.shields.io/npm/v/asset-list-webpack-plugin.svg?colorB=brightgreen)](https://www.npmjs.com/package/asset-list-webpack-plugin)

# Asset List Webpack Plugin
This is a [webpack](https://webpack.js.org) plugin that outputs a simple list of generated assets with your webpack bundle.

## Install
`npm install --save-dev asset-list-webpack-plugin`

## Usage
The plugin will generate a JSON file that lists all of the generated assets from the webpack bundle process. The format of this list can be changed by setting different options.

Here is a basic example utilizing a simple config from the [webpack Getting Started guide](https://webpack.js.org/guides/getting-started):

**webpack.config.js**
```javascript
const path = require('path');

const AssetListWebpackPlugin = require('asset-list-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins:  [new AssetListWebpackPlugin()]
};

```

This will generate a JSON file in the output path containing the following:

**assets.json**
```json
[{
  "filename": "main.js",
  "name": "main",
  "type": "js"
}]
```

Additionally, you pass a hash of options to change the format of the JSON file like so:

**webpack.config.js**
```javascript
const path = require('path');

const AssetListWebpackPlugin = require('asset-list-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins:  [new AssetListWebpackPlugin({
    name: 'file-list',
    format: 'object',
    key: 'name'
  })]
};

```

This will generate a JSON file that contains the following:

**file-list.json**
```json
{
  "main": {
    "filename": "main.js",
    "name": "main",
    "type": "js"
  }
}
```

## Options
| Name | Type | Default | Description |
|---|---|---|---|
| **name** | `{String}` | `'assets'` | Name of generated JSON file |
| **format** | `{'array'\|'object'}` | `'array'` | Format of generated JSON file |
| **key** | `{'filename'\|'name'\|'type'\|'hash'}` | `'filename'` | Set keys for object formatted JSON file |

## License
This open source project is licensed under the [MIT License](https://choosealicense.com/licenses/mit).