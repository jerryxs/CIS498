var rn_bridge2 = require('rn-bridge');
var 'csvData' = [{ 'licNum' = 'null',
    'fName' = 'null',
    'lName' = 'null',
    'dob' = 'null',
    'address' = 'null',
    'town' = 'null',
    'st8' = 'null',
    'gndr' = 'null'
  }];
  

  var fast_csv = require('fast-csv');
  var fs = require('fs');

  //var csvStream = fast_csv.createWriteStream({headers: true}),
    var writableStream = fs.createWriteStream('licData.csv');
	
	csv.write('csvData')
	.pipe(writableStream);

//writableStream.on("finish", function(){
 // console.warn("done!");
//});

  var fileStream = fs.createReadStream("licData.csv"),
      parser = fastCsv();



  rn_bridge2.channel.on('message', (msg2) => {
    'csvData' = msg2,
    /*csvStream.pipe(writableStream);
    csvStream.write('csvData');
    csvStream.end;
    .on("readable", function () {
        var data;
        while ((data = fileStream.read()) !== null) {
            parser.write(data);
        }
    })
    .on("end", function () {
        parser.end();
    });*/

    rn_bridge2.channel.send(msg2);
  } );


  
