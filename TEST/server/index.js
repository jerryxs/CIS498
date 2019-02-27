var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var busboy = require("connect-busboy");
var fs = require("fs");
var path = require("path");
let csvToJson = require("convert-csv-to-json");
var arr = [];
var jsonObj = [];

server.listen(8000);

app.use(busboy());
//app.use(express.static(path.join(__dirname, "public")));

/* ========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route("/upload").post(function(req, res, next) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on("file", function(fieldname, file, filename) {
    console.log("Uploading: " + filename);

    //Path where image will be uploaded
    fstream = fs.createWriteStream(__dirname + "/fileupload/" + filename);
    file.pipe(fstream);
    fstream.on("close", function() {
      console.log("Upload Finished of " + filename);

      res.redirect("back"); //where to go next
    });
  });
  fs.readFile("servertest.csv", (err, data) => {
    if (err) {
      return console.log(err);
    }

    //Convert and store csv information into a buffer.
    bufferString = data.toString();

    //Store information for each individual person in an array index. Split it by every newline in the csv file.
    arr = bufferString.split("\n");
    console.log(arr);

    for (var i = 1; i < arr.length; i++) {
      var data = arr[i].split(",");
      var obj = {};
      var headers = arr[0].split(",");
      for (var j = 0; j < data.length; j++) {
        obj[headers[j].trim()] = data[j].trim();
      }
      jsonObj.push(obj);
    }
    JSON.stringify(jsonObj);
    console.log(jsonObj);

    //JSON.parse(arr);
    //res.send(arr);
  });
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// When devices connect to the server...
io.on("connection", function(socket) {
  // log the socket ID of the device
  console.log(socket.id);

  socket.on("onPressEnterData", data => {
    console.log("Client Message: ");
    console.log(data.dataStored);

    //const user = data.csvData;

    socket.broadcast.emit("receiveUserData", { data });
  });
});
