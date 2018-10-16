const { RawSource } = require('webpack-sources');

function AssetListPlugin(options) {
  this.options = options || { name: 'assets', mode: 'array' };
}

AssetListPlugin.prototype.apply = function(compiler) {
  var outputName = this.options.name || 'assets';
  var mode = this.options.mode || 'array';
  var key = this.options.key || 'name';

  compiler.plugin('emit', function(compilation, cb) {
    var assets;

    if(mode === 'object') {
      assets = {};

      for(var fullAssetName in compilation.assets) {
        var fullSplitAssetName = fullAssetName.split('.');

        var val = {
          fullname: fullAssetName,
          name: fullSplitAssetName[0]
        };

        if(fullSplitAssetName.length > 1) {
          val.type = fullSplitAssetName[fullSplitAssetName.length-1];
        }

        if(fullSplitAssetName.length > 2) {
          val.hash = fullSplitAssetName[fullSplitAssetName.length-2];
        }

        if(!val[key]) throw new Error('Specified key does not exist!');
        assets[val[key]] = val;
      }
    } else {
      assets = [];
      for(var fullAssetName in compilation.assets) {
        assets.push(fullAssetName);
      }
    }

    compilation.assets[outputName+'.json'] = new RawSource(JSON.stringify(assets));

    cb();
  });
};

module.exports = AssetListPlugin;
