'use strict';

var tuberDeploy = require("tuber-deploy");
var fs = require("fs");

module.exports = {
  deployController: function(location, sshKey, privateKey, initJsonData, controllerFn, callback) {

    var tmpFolder = ".tmp";
    var packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

    // // http://stackoverflow.com/questions/21194934/node-how-to-create-a-directory-if-doesnt-exist/21196961#21196961
    if (!fs.existsSync(tmpFolder)){ fs.mkdirSync(tmpFolder); }

    //write package.json
    var packageJsonInFolderName = tmpFolder + "/" + "package.json";
    fs.writeFileSync(packageJsonInFolderName, JSON.stringify(packageJson), "UTF-8", {'flags': 'w+'});

    //write Dockerfile
    var dockerfileInFolderName = tmpFolder + "/" + "Dockerfile";
    var dockerFileData = fs.readFileSync(__dirname + "/templates/Dockerfile", "utf-8");
    fs.writeFileSync(dockerfileInFolderName, dockerFileData, "UTF-8", {'flags': 'w+'});

    //write server.js
    var serverJsData = 
      "var macstack = require('macstack')();\n\n" +
      "var callback = " +
      controllerFn.toString() +
      ";\ncallback(macstack);\n";

    var serverInFolderName = tmpFolder + "/" + "server.js";
    fs.writeFileSync(serverInFolderName, serverJsData, "UTF-8", {'flags': 'w+'});

    //maybe just forward dependencies for now
    tuberDeploy.genericBuildAndCreate(location, tmpFolder, sshKey, privateKey, initJsonData, callback);
  }
};