const { json } = require('express');
const express = require('express')
const app = express()
const port = 3000
const FPT_OUTPUT_DIR = "./out"
const WEBGL_DIR = "public"

var fs = require('fs');
var path = require('path');

// STATIC
app.use('/webgl', express.static(WEBGL_DIR))

// API 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/fpt/parse', async (req, res) => {
  deleteFolderRecursive(FPT_OUTPUT_DIR);
  try {
    let output = await shellCommand('java -jar FloorPlanToolStandalone.jar SimpleFloorPlan.fpt');
    let jsonFile = fromDir(FPT_OUTPUT_DIR, '.json');
    let jsonData = fs.readFileSync(jsonFile);
    jsonData = JSON.parse(jsonData);
    if (jsonFile) {
      return res.json({ok:true, data: jsonData})
    } else {
      return res.json({ok:true, msg: 'cannot find output json'})
    }
    
  } catch(err) {
    return res.json({ok: false, msg: err});
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

// UTILITY
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// return the first file matched extension filter
function fromDir(startPath, filter){
  if (!fs.existsSync(startPath)){
      console.log("no dir ",startPath);
      return;
  }

  var files=fs.readdirSync(startPath);
  for(var i=0;i<files.length;i++){
      var filename=path.join(startPath,files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
          fromDir(filename,filter); //recurse
      }
      else if (filename.indexOf(filter)>=0) {
          return filename;
      };
  };
  return null;
};

function shellCommand(cmd) {
  var exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, (error, stdout, stderr) => {
    if (error) {
     reject(error)
    }
    resolve(stdout);
   });
  });
 }