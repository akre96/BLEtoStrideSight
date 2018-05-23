var async = require('async');
var noble = require('noble');
var fs = require('fs');

var peripheralIdOrAddress = 'b8:27:eb:a0:19:59';
var file = "test6";

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  //if (peripheral.advertisement.localName == "raspberrypi"){
  console.log(peripheral.address);
  if (peripheral.id === peripheralIdOrAddress || peripheral.address === peripheralIdOrAddress) {
    noble.stopScanning();

    //console.log('peripheral with ID ' + peripheral.id + ' found');
    var advertisement = peripheral.advertisement;

    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;

    if (localName) {
      //console.log('  Local Name        = ' + localName);
    }

    if (txPowerLevel) {
      console.log('  TX Power Level    = ' + txPowerLevel);
    }

    if (manufacturerData) {
      //console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
    }

    if (serviceData) {
      //console.log('  Service Data      = ' + JSON.stringify(serviceData, null, 2));
    }

    if (serviceUuids) {
      //console.log('  Service UUIDs     = ' + serviceUuids);
    }

    //console.log();

    readData(peripheral);
  }
  else{ console.log("not found");}
});

function readData(peripheral) {

  peripheral.on('disconnect', function() {
    process.exit(0);
  });

  peripheral.connect(function(error) {
        if(error){
            console.log(error);
        }
        else{
            console.log('connected');
        }
       peripheral.discoverServices(['fff6'], function(error, services) {
            if (error){
                console.log(error);
            }
            else
            {
                services[0].discoverCharacteristics(['fff7'],function(error,characteristics){
                    if(error){
                        console.log(error);
                    } 
                    else{
                        console.log('viewing characteristics');
                        filename = "data/"+file+".txt";
                        dataStream = fs.createWriteStream(filename, {'flags':'a+'});
                        characteristics[0].write(Buffer.from("test","utf8"));
                        characteristics[0].subscribe();
                        characteristics[0].on('data',function(data){
                            logData(data);
                        });
                            
                    }
                });
            }
            
       }); 
  });

}

function logData(data) {
    formattedData = data.toString('utf8')+"\n";
    dataStream.write(formattedData);
}

        

