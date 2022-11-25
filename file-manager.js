const fs = require("fs");
const path = require("path");

module.exports = function (RED) {
  function SaveFile(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.name = config.name;
    node.filePath = config.filePath || "";
    node.on("input", function (msg) {
      const filePath = node.filePath || msg.path;
      if (!filePath || filePath == "") {
        msg.payload = "No File Path Found";
        node.send(msg);
      } else if (!msg.file || msg.file == "") {
        msg.payload = "No File Found";
        node.send(msg);
      } else {
        let constDirname = new String(filePath).split("/");
        constDirname.pop();
        constDirname = constDirname.join("/");

        const folderpath=path.join(__dirname,"../../");
        let _filePath=path.join(__dirname,"../../");
        _filePath=path.join(_filePath,filePath)

        const dir = path.join(folderpath, constDirname);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(_filePath, msg.file);
        msg.payload = {
          fullpath:_filePath,
          dir:dir,
          path:filePath,
        }
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType("fm-save-file", SaveFile);
};
