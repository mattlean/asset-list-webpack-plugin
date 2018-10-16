const { RawSource } = require('webpack-sources');

function AssetListPlugin(options) {
  this.options = options || { name: 'assets', format: 'array' };
}

AssetListPlugin.prototype.apply = function(compiler) {
  var logPrefix = 'asset-list-webpack-plugin: ';
  var outputName = this.options.name || 'assets';

  var format = this.options.format || 'array';
  if(format !== 'array' && format !== 'object') {
    throw new Error(logPrefix+'Plugin only supports "array" or "object" formats.');
  }

  var key = this.options.key;
  if(key && format === 'array') {
    console.warn(logPrefix+'Ignoring key option since format is set to array.');
  } else if(!key && format === 'object') {
    key = 'fullname';
  }

  compiler.plugin('emit', function(compilation, cb) {
    var assets = format === 'object' ? {} : [];

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
