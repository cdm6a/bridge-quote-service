var Promise            = require('bluebird');
var validator          = require('validator');
var UInt160            = require('ripple-lib').UInt160;
var _                  = require('lodash');
var logger             = require(__dirname + '/../core/logger.js');
var RippleQuoteService = require(__dirname + '/ripple_quote_service.js');
var BridgeQuote        = require(__dirname + '/../quotes/bridge_quote.js');

function BridgeQuoteService() {}

BridgeQuoteService.prototype.build = function(options) {
  var _this = this;
  var bridgeQuote = new BridgeQuote({});
  return new Promise(function(resolve, reject) {
    _this.validate(options)
      .then(function(quote) {
        return RippleQuoteService.build(quote);
      })
      .then(function(rippleQuote) {
        bridgeQuote.ripple_quote = rippleQuote;
        resolve(bridgeQuote);
      })
      .error(reject);
  })
};

/**
 *  Validates the parameters for building a bridge quote
 *
 *  @param {Object} options                         - Holds various options
 *  @param {String}  [options.source_address]       - Sending ripple address
 *  @param {String}  [options.destination_address]  - Receiving ripple address
 *  @param {String}  [options.amount]               - Amount '+' currency formatted string
 *
 *  @promise {Object}
 *    @resolve {Object}
 *    @reject  {Error}
 */
BridgeQuoteService.prototype.validate = function(options) {
  return new Promise(function(resolve, reject) {
    if (!UInt160.is_valid(options.destination_address)) {
      logger.warn('[bridge_quote_service.js:validate] Destination address is not a valid ripple address [%s]', options.destination_address);
      return reject(new Error('Destination address is not a valid ripple address'));
    }
    if (!UInt160.is_valid(options.source_address)) {
      logger.warn('[bridge_quote_service.js:validate] Source address is not a valid ripple address [%s]', options.source_address);
      return reject(new Error('Source address is not a valid ripple address'));
    }
    var amount = options.amount.split('+');
    var value = parseFloat(amount[0]);
    if (amount.length !== 2 || !_.isNumber(value) || !validator.isAlpha(amount[1]) || !validator.isLength(amount[1], 3, 3)) {
      logger.warn('[bridge_quote_service.js:validate] Amount is not valid [%s]', options.amount);
      return reject(new Error('Amount is not valid'));
    }
    resolve({
      destination: {
        address: options.destination_address,
        amount: value,
        currency: amount[1]
      },
      source: {
        address: options.source_address
      }
    })
  })
};

module.exports = new BridgeQuoteService();