ArduinoEthernetCom: Simple communication between Arduinos and Browsers
========================================================================

The ArduinoEthernetCom library was created to simplify communication between Arduinos and browsers without requiring
Flash or Java or drivers or anything else.

ArduinoEthernetCom allows you to create a simple server on an Ethernet-enabled Arduino (i.e. an Arduino with an Ethernet
shield, or an ArduinoEthernet) by uploading a tiny sketch to the device, and then stream data into the browser over an
Ethernet connection. You can see an example running live on GitHub [here](http://sfentress.github.com/ArduinoEthernetCom/example.html).

To read more about streaming data to your computer over an Ethernet cable, read [this blog post](http://blog.concord.org/streaming-arduino-data-to-a-browser).

License
-------

ArduinoEthernetCom is Copyright 2012 (c) by the Concord Consortium and is distributed under
any of the following licenses:

- [Simplified BSD](http://www.opensource.org/licenses/BSD-2-Clause),
- [MIT](http://www.opensource.org/licenses/MIT), or
- [Apache 2.0](http://www.opensource.org/licenses/Apache-2.0).

Using the library
-----------------
  
    // Define an ArduinoEthernetCom with optional options
    var arduinoEthernetCom = new ArduinoEthernetCom(_options_);
    
    // Define one or more observers to be notified each time the data updates
    var dataDidUpdate = function(data) {
      var pinA0Value = data.A0;           // data is returned as a hash of values
      graph(pinA0Value)                   // do whatever
    }
  
    arduinoEthernetCom.addObserver(dataDidUpdate);
    
    // start polling the Arduino, calling all the observers each time with data
    arduinoEthernetCom.start();
    
    // some time later
    arduinoEthernetCom.stop();
    
    // this will grab the current values of the pins. This is probably not as useful
    // as the start() method, which continually polls the data.
    arduinoEthernetCom.getData();
    
    
### Options

You can pass a hash of options to ArduinoEthernetCom, e.g. `var arduinoEthernetCom = new ArduinoEthernetCom({frequency: 2, generate_random_data: true});`

* **arduino\_server\_ip**: 
  * IP that the Arduino server is running on. **Default**: http://169.254.1.1
* **frequency**: 
  * Frequency of data collection in Hertz. **Default**: 4 (i.e. we will request data 4 times a second)
* **delay\_time**: 
  * Alternative way of defining frequency, in ms. **Default**: None, the above already defines 250 ms
* **generate\_random\_data**: 
  * If true, random floating voltages will be generated for all 6 pins. This means you don't need to connect an Arduino, so it can be used for testing. **Default**: false
* **callback_function_name**:
  * The function called by the Arduino's script to send JSON-P data. This shouldn't be changed unless the sketch is modified. **Default**: arduinoEthernetComCallback

Using this with an Arduino on a web page
----------------------------------------

1. Upload the server sketch located at Arduino/JSONPSensorServer.ino to the Arduino. This will start a server running at http://169.254.1.1. If you need to use a different IP address, you must modify the sketch.
2. Plug the Arduino into the computer with an Ethernet cable. Wait about 30 seconds for the server to boot up.
3. Use the ArduinoEthernetCom library to get data from the Arduino.