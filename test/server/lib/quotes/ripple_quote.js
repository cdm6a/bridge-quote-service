var util               = require('util');
var chai               = require('chai');
var chaiAsPromised     = require('chai-as-promised');
var sinon              = require('sinon');
var RippleRestClient   = require('ripple-rest-client');
var RippleQuote        = require(__dirname + '/../../../../server/lib/quotes/ripple_quote.js');
var rippleQuoteFixture = require(__dirname + '/../../../fixtures/ripple_quote.js');

describe('ripple_quote', function() {

  chai.use(chaiAsPromised);

  it('.validate() should successfully validate a ripple quote', function(done) {
    var quote = new RippleQuote(rippleQuoteFixture.valid);
    quote.validate()
      .then(done)
      .catch(done);
  });

  it('.validate() should fail to validate a ripple quote (amount)', function() {
    var quote = new RippleQuote(rippleQuoteFixture.invalid.destination_amount);
    return chai.assert.isRejected(quote.validate(), 'Amount is not valid number');
  });

  it('.validate() should fail to validate a ripple quote (currency)', function() {
    var quote = new RippleQuote(rippleQuoteFixture.invalid.destination_currency);
    return chai.assert.isRejected(quote.validate(), 'Currency is not valid');
  });

  it('.validate() should fail to validate a ripple quote (address)', function() {
    var quote = new RippleQuote(rippleQuoteFixture.invalid.destination_address);
    return chai.assert.isRejected(quote.validate(), 'Address is not a valid ripple address');
  });

  it('.validate() should fail to validate a ripple quote (issuer)', function() {
    var quote = new RippleQuote(rippleQuoteFixture.invalid.source_address);
    return chai.assert.isRejected(quote.validate(), 'Issuer is not a valid ripple address');
  });

  it('.build() calls ripple-rest with the provided args', function(done) {
    var stub = sinon.stub(RippleRestClient.prototype, 'buildPayment')
      .yields(null, rippleQuoteFixture.ripple_rest_response.valid);
    var quote = new RippleQuote(rippleQuoteFixture.valid);
    quote.build()
      .then(function() {
        chai.assert.ok(stub.withArgs({
          amount: rippleQuoteFixture.valid.destination.amount,
          currency: rippleQuoteFixture.valid.destination.currency,
          recipient: rippleQuoteFixture.valid.destination.address
        }).called);
        stub.restore();
        done();
      })
      .catch(function(error) {
        stub.restore();
        if (util.isError(error)) {
          done(error);
        }
        done(new Error(JSON.stringify(error)));
      });
  });
});