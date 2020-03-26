/**
 * In order to resolve the path name for the required package, it is a must that
 * the author stats the main file for that package. unless there is no way
 * to the resovling happens leaving manual resoving.
 * 
 * @param {extension} String for the main file as defined in the package.js of the module
 * @param {modules} List modules which the path should be resolved of
 * @param {package} String package manager which installed the module, default is npm
 */
let fetch_path = function (extension, modules, manager = "npm") {
  return new Promise((resolve, reject) => {
    if (manager === "npm") {
      var paths = modules.filter((module) => require.resolve(module)
        .match(`\.(?:${ext})$`))
        .map((module) => require.resolve(module));
      resolve(Array.from(paths));
    } else if (manager === "bower") {
      bower
        .commands
        .list({
          paths: true,
          json: true
        })
        .on('error', (error) => reject(error))
        .on('end', (result) => {
          var packagePaths = JSON.parse(JSON.stringify(result));
          var paths = modules.filter((module) => !module.startsWith('!') && packagePaths[module].match(`\.(?:${ext})$`))
            .map((module) => path.join(__dirname, packagePaths[module]));
          resolve(Array.from(paths));
        });
    }
  });
}
module.exports = fetch_path;