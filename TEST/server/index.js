var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var busboy = require("connect-busboy");
var fs = require("fs");
var path = require("path");
var ObjectsToCsv = require("objects-to-csv");
const csv = require("csvtojson");
var arr = [];
var bannedList = [];

server.listen(8000);

app.use(busboy());
//app.use(express.static(path.join(__dirname, "public")));

/* ========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
function uploadFile() {
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
        fs.readFile("./server/fileupload/" + filename, (err, data) => {
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
            bannedList.push(obj);
          }
          JSON.stringify(bannedList);
          console.log(bannedList);

          io.emit("gotBannedList", { bannedList });
        });
      });
    });
  });

  return bannedList;
}

var bannedList = uploadFile();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// When devices connect to the server...
io.on("connection", function(socket) {
  // log the socket ID of the device
  console.log(socket.id);

  if (fs.existsSync("./server/fileupload/test.csv")) {
    csv()
      .fromFile("./test.csv")
      .then(bannedGuestList => {
        socket.emit("gotBannedList", { bannedGuestList });
        console.log(bannedGuestList);
      });
  } else {
    socket.emit("noBannedList");
  }

  function submitPressed() {
    var guestList = [];
    socket.on("onPressEnterData", data => {
      console.log("Client Message: ");
      console.log(data.dataStored);

      socket.broadcast.emit("receiveUserData", { data });

      guestList.push(data.dataStored);
      new ObjectsToCsv(guestList).toDisk("./guests.csv", { append: true });
      guestList.pop(data.dataStored);
    });
    return guestList;
  }

  if (fs.existsSync("./guests.csv")) {
    csv()
      .fromFile("./guests.csv")
      .then(jsonObj => {
        socket.emit("needGuestList", { jsonObj });
        console.log(jsonObj);
      });
  }
});
