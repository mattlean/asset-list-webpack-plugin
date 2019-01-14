const { RawSource } = require('webpack-sources');

function AssetListPlugin(options) {
  this.options = options || { name: 'assets', format: 'array' };
}

AssetListPlugin.prototype.apply = function(compiler) {
  var logPrefix = 'asset-list-webpack-plugin: ';
  var outputName = this.options.name || 'assets';

  var format = this.options.format || 'array';
  if(format !== 'array' && format !== 'object') {
    throw new Error(logPrefix+'"'+this.options.format+'" format is not supported.');
  }

  var key = this.options.key;
  if(key && format === 'array') {
    console.warn(logPrefix+'Ignoring key option since format is set to array.');
  } else if(!key && format === 'object') {
    key = 'filename';
  }

  compiler.hooks.emit.tapAsync('Asset List Plugin', function(compilation, cb) {
    var assets = format === 'object' ? {} : [];

    for(var filename in compilation.assets) {
      var splitFilename = filename.split('.');

      var val = {
        filename: filename,
        name: splitFilename[0]
      };

      if(splitFilename.length > 3) {
        if(splitFilename[splitFilename.length-1] === 'map') {
          val.type = splitFilename[splitFilename.length-2]+'.'+splitFilename[splitFilename.length-1];
          val.fingerprint = splitFilename[splitFilename.length-3];
        }
      }

      if(!val.type && splitFilename.length > 1) {
        val.type = splitFilename[splitFilename.length-1];
      }

      if(!val.fingerprint && splitFilename.length > 2) {
        val.fingerprint = splitFilename[splitFilename.length-2];
      }

      if(format === 'object') {
        if(!val[key]) throw new Error(logPrefix+'Specified key does not exist!');

        if(assets[val[key]]) {
          if(Array.isArray(assets[val[key]])) {
            assets[val[key]].push(val);
          } else {
            assets[val[key]] = [assets[val[key]], val];
          }
        } else {
          assets[val[key]] = val;
        }
      } else {
        assets.push(val);
      }
    }

    compilation.assets[outputName+'.json'] = new RawSource(JSON.stringify(assets));

    cb();
  });
};

module.exports = AssetListPlugin;
