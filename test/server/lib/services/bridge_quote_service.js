var chai               = require('chai');
var chaiAsPromised     = require('chai-as-promised');
var BridgeQuoteService = require(__dirname + '/../../../../server/lib/services/bridge_quote_service.js');
var bridgeQuoteFixture = require(__dirname + '/../../../fixtures/bridge_quote.js');

describe('bridge_quote_service', function() {

  chai.use(chaiAsPromised);

  it('.validate() should successfully validate a bridge quote request', function(done) {
    BridgeQuoteService.validate(bridgeQuoteFixture.valid)
      .then(function(valid) {
        chai.assert.strictEqual(valid.destination.address, bridgeQuoteFixture.valid.destination_address);
        chai.assert.strictEqual(valid.destination.amount, 5.00);
        chai.assert.strictEqual(valid.destination.currency, 'USD');
        chai.assert.strictEqual(valid.source.address, bridgeQuoteFixture.valid.source_address);
        done();
      })
      .catch(done);
  });

  it('.validate() should fail because of an invalid (amount)', function() {
    return chai.assert.isRejected(BridgeQuoteService.validate(bridgeQuoteFixture.invalid.amount), 'Amount is not valid');
  });

  it('.validate() should fail because of an invalid (destination_address)', function() {
    return chai.assert.isRejected(BridgeQuoteService.validate(bridgeQuoteFixture.invalid.destination_address), 'Destination address is not a valid ripple address');
  });

  it('.validate() should fail because of an invalid (source_address)', function() {
    return chai.assert.isRejected(BridgeQuoteService.validate(bridgeQuoteFixture.invalid.source_address), 'Source address is not a valid ripple address');
  });

  it('.build() should fail because an invalid amount and validate fails', function() {
    return chai.assert.isRejected(BridgeQuoteService.build(bridgeQuoteFixture.invalid.amount), 'Amount is not valid');
  })
});