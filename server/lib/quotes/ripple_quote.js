var validator        = require('validator');
var _                = require('lodash');
var Promise          = require('bluebird');
var UInt160          = require('ripple-lib').UInt160;
var logger           = require(__dirname + '/../core/logger.js');
var RippleRestClient = require('ripple-rest-client');

var rippleRestClient = new RippleRestClient({
  api: 'https://api.ripple.com/'
});

function RippleQuote(options) {
  this.destination = options.destination;
  this.source = options.source;
}

RippleQuote.prototype.build = function() {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.validate()
      .then(function() {
        rippleRestClient.account = _this.source.address;
        rippleRestClient.buildPayment({
          amount: _this.destination.amount,
          currency: _this.destination.currency,
          recipient: _this.destination.address
        }, function(error, response) {
          if (error) {
            logger.warn('[rippe_quote.js:build] Received unsuccessful response from ripple-rest:', error);
            reject(error);
          } else {
            resolve(response.payments);
          }
        });
      }).error(reject);
  });
};

RippleQuote.prototype.validate = function() {
  var _this = this;
  return new Promise(function(resolve, reject) {
    if (!_.isNumber(_this.destination.amount)) {
      logger.warn('[rippe_quote.js:validate] Destination amount is not valid number [%d]', _this.destination.amount);
      return reject(new Error('Destination amount is not valid number'));
    }
    if (!validator.isAlpha(_this.destination.currency) || !validator.isLength(_this.destination.currency, 3, 3)) {
      logger.warn('[rippe_quote.js:validate] Destination currency is not valid [%s]', _this.currency);
      return reject(new Error('Destination currency is not valid'));
    }
    if (!UInt160.is_valid(_this.destination.address)) {
      logger.warn('[rippe_quote.js:validate] Destination address is not a valid ripple address [%s]', _this.destination.address);
      return reject(new Error('Destination address is not a valid ripple address'));
    }
    if (!UInt160.is_valid(_this.source.address)) {
      logger.warn('[rippe_quote.js:validate] Source address is not a valid ripple address [%s]', _this.source.address);
      return reject(new Error('Source address is not a valid ripple address'));
    }
    resolve();
  });
};


module.exports = RippleQuote;