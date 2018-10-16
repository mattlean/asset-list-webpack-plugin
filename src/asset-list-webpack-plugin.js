const { RawSource } = require('webpack-sources');

function AssetListPlugin(options) {
  this.options = options || { name: 'assets', mode: 'array' };
}

AssetListPlugin.prototype.apply = function(compiler) {
  var logPrefix = 'asset-list-webpack-plugin: ';
  var outputName = this.options.name || 'assets';

  var mode = this.options.mode || 'array';
  if(mode !== 'array' && mode !== 'object') {
    throw new Error(logPrefix+'Plugin only supports "array" or "object" modes.');
  }

  var key = this.options.key;
  if(key && mode === 'array') {
    console.warn(logPrefix+'Ignoring key option since mode is set to array.');
  } else if(!key && mode === 'object') {
    key = 'fullname';
  }

  compiler.plugin('emit', function(compilation, cb) {
    var assets = mode === 'object' ? {} : [];

    for(var fullname in compilation.assets) {
      var splitFullname = fullname.split('.');

      var val = {
        fullname: fullname,
        name: splitFullname[0]
      };

      if(splitFullname.length > 1) {
        val.type = splitFullname[splitFullname.length-1];
      }

      if(splitFullname.length > 2) {
        val.hash = splitFullname[splitFullname.length-2];
      }

      if(mode === 'object') {
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
