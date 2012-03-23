/*
  ==========================================================================
  Project:   ArduinoEthernetCom
  Repo:      http://github.com/sfentress/ArduinoEthernetCom
  Copyright: ©2010 Concord Consortium, see README for license
  Author:    Sam Fentress <sfentress@gmail.com>
  ==========================================================================
  
  ArduinoEthernetCom library for simple communication with an Arduino via an Ethernet connection.
  
  See README for license and documentation, and http://sfentress.github.com/ArduinoEthernetCom/example.html
  to see it live.
  
  This library will add two global objects to your JavaScript environment, ArduinoEthernetCom and the callback
  function for the Arduino server, arduinoEthernetComCallback.
*/
  
(function () {
  
  // Defaults
  var ARDUINO_SERVER_IP      = "http://169.254.1.1",
      FREQUENCY              = 2,
      GENERATE_RANDOM_DATA   = false,
      CALLBACK_FUNCTION_NAME = 'arduinoEthernetComCallback';

  var ArduinoEthernetCom = function (options) {
      this.arduino_server_ip = options.arduino_server_ip || ARDUINO_SERVER_IP;
      this.frequency = options.frequency || (options.delay_time ? 1000 / options.delay_time : 0 || FREQUENCY);
      this.generate_random_data = options.generate_random_data || GENERATE_RANDOM_DATA;
      var callback_function_name = options.callback_function_name || CALLBACK_FUNCTION_NAME;
      
      var self = this;
      window[callback_function_name] = function(jsonString) {
        self.callback(jsonString);
      }
    };

  // Private vars
  var dataTimer,
      observers      = [],
      analogPins     = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];

  ArduinoEthernetCom.prototype = {
    addObserver: function (func) {
      observers.push(func);
    },

    removeObserver: function (func) {
      if (~observers.indexOf(func)) {
        observers.splice(observers.indexOf(func), 1);
      }
    },

    start: function () {
      var self = this;
      dataTimer = setInterval(function () {
        self.getData();
      }, (1000 / this.frequency));
    },

    stop: function () {
      clearInterval(dataTimer);
    },

    getData: function () {
      if (this.arduino_server_ip && !this.generate_random_data) {
        this.getJSONP(this.arduino_server_ip);
      } else {
        this.callback(this.getNextRandomData());
      }
    },

    currentRandomData: null,

    getNextRandomData: function () {
      var i, ii, pin;
      if (!this.currentRandomData) {
        this.currentRandomData = {};
        for (i = 0, ii = analogPins.length; i < ii; i++) {
          pin = analogPins[i];
          this.currentRandomData[pin] = Math.floor(Math.random() * 1025);
        }
      }

      for (i = 0, ii = analogPins.length; i < ii; i++) {
        pin = analogPins[i];
        this.currentRandomData[pin] = this.currentRandomData[pin] + Math.floor(((Math.random() - 0.5) * 100));
        this.currentRandomData[pin] = Math.max(Math.min(this.currentRandomData[pin], 1024), 0);
      }

      return JSON.stringify(this.currentRandomData);
    },

    callback: function (jsonString) {
      var data = JSON.parse(jsonString),
        i, ii;
      for (i = 0, ii = observers.length; i < ii; i++) {
        observers[i](data);
      }
    },
    
    getJSONP: function (url) {
      var oHead = document.getElementsByTagName('HEAD').item(0),
          oScript= document.createElement("script");
      oScript.type = "text/javascript";
      oScript.src=url;
      oHead.appendChild(oScript);
      setTimeout(function() {
          oHead.removeChild(oScript);
      }, 1000);
    }
  };

  window.ArduinoEthernetCom = ArduinoEthernetCom;
})();