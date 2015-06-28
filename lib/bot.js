'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var whatsapi = require('whatsapi');

var Errors = require('./errors');

function Bot(options) {
  options = options || {};
  options.adapter = options.adapter || {};

  if (!options.adapter.msisdn) {
    throw Errors.InvalidArgumentError({
      argument: 'adapter.msisdn',
      given: options.adapter.msisdn,
      expected: 'String'
    });
  }
  if (!options.adapter.password) {
    throw Errors.InvalidArgumentError({
      argument: 'adapter.password',
      given: options.adapterpassword,
      expected: 'String'
    });
  }
  if (!options.adapter.ccode) {
    throw Errors.InvalidArgumentError({
      argument: 'adapter.ccode',
      given: options.adapter.ccode,
      expected: 'String'
    });
  }

  this.adapter = whatsapi.createAdapter(options.adapter);
  this.adapter.on('error', function reportError(err) {
    self.emit('error', err);
  });
  this.triggers = [];
}

util.inherits(Bot, EventEmitter);

Bot.prototype.connect = function connect(callback) {
  var self = this;

  function onLogin(err) {
    if (err) {
      callback(Errors.ConnectionError(err));
      return;
    }
    self.adapter.sendIsOnline();
    callback(null);
  }

  this.adapter.connect(function onConnect(err) {
    if (err) {
      callback(Errors.ConnectionError(err));
      return;
    }
    self.adapter.login(onLogin);
  });
};

Bot.prototype.registerAction = function(trigger, action) {

};

Bot.prototype.destroy = function destroy() {
  this.adapter.sendIsOffline();
  this.adapter.disconnect();
};

module.exports = Bot;