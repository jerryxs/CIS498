var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var busboy = require("connect-busboy");
var multer = require("multer");
var storage = multer.diskStorage({
  destination: "server/pics",
  filename: function(req, file, cb) {
    //req.body is empty...
    //How could I get the new_file_name property sent from client here?
    cb(null, file.originalname + "-" + Date.now() + ".jpg");
  }
});
var upload = multer({ storage: storage });
var fs = require("fs");
var path = require("path");
var ObjectsToCsv = require("objects-to-csv");
const csv = require("csvtojson");
const crypto = require("crypto");
const dir = "/fileUpload/";
const dt = new Date();
var eventDate = dt.getMonth() + 1 + "_" + dt.getDate() + "_" + dt.getFullYear();

server.listen(8000);

app.use(busboy());

app.post("/upload", function(req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on("file", function(fieldname, file, filename) {
    console.log("Uploading: " + filename);

    if (!fs.existsSync("/server/fileUpload")) {
      fs.mkdir("server/fileUpload", err => {
        if (err) {
          console.log(err);
        }
      });
    }

    fstream = fs.createWriteStream(__dirname + dir + filename);

    file.pipe(fstream);
    fstream.on("close", function() {
      console.log("Upload Finished of " + filename);

      res.redirect("back"); //where to go next
      csv()
        .fromFile("./server/fileUpload/test.csv")
        .then(jsonObj => {
          jsonObj.forEach(index => {
            var hashLic = crypto
              .createHash("sha256")
              .update(index.licNum)
              .digest("hex");

            var hashAdd = crypto
              .createHash("sha256")
              .update(index.address)
              .digest("hex");

            index.licNum = hashLic;
            index.address = hashAdd;
          });
          console.log(jsonObj);
          io.emit("gotBannedList", { jsonObj });
        });
    });
  });
});

app.post("/", upload.single("guestPicture"), (req, res) => {
  console.log("Got Picture: ");
  res.send("Complete");
  console.log(req.file);
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

if (!fs.existsSync("server/guestLists")) {
  fs.mkdir("server/guestLists", err => {
    if (err) {
      console.log(err);
    }
  });
}

if (!fs.existsSync("server/pics")) {
  fs.mkdir("server/pics", err => {
    if (err) {
      console.log(err);
    }
  });
}

// When devices connect to the server...
io.on("connection", function(socket) {
  // log the socket ID of the device
  console.log(socket.id);

  if (fs.existsSync("./server/fileUpload/test.csv")) {
    csv()
      .fromFile("./server/fileUpload/test.csv")
      .then(jsonObj => {
        jsonObj.forEach(index => {
          var hashLic = crypto
            .createHash("sha256")
            .update(index.licNum)
            .digest("hex");
          //console.log(index);

          var hashAdd = crypto
            .createHash("sha256")
            .update(index.address)
            .digest("hex");
          //console.log(index);

          index.licNum = hashLic;
          index.address = hashAdd;
          //console.log(index);
        });
        socket.emit("gotBannedList", { jsonObj });
        console.log("Banned List: ");
        console.log(jsonObj);
      });
  } else {
    socket.emit("noBannedList");
  }

  var guestList = [];
  socket.on("onPressEnterData", data => {
    console.log("Client Message: ");
    console.log(data.dataStored);

    socket.broadcast.emit("receiveUserData", { data });

    guestList.push(data.dataStored);
    new ObjectsToCsv(guestList).toDisk("./guestList_" + eventDate + ".csv", {
      append: true
    });
    guestList.pop(data.dataStored);
  });

  if (fs.existsSync("./guestList_" + eventDate + ".csv")) {
    csv()
      .fromFile("./guestList_" + eventDate + ".csv")
      .then(jsonObj => {
        socket.emit("needGuestList", { jsonObj });
        console.log(jsonObj);
      });
  }
});
