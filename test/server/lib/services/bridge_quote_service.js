var chai               = require('chai');
var chaiAsPromised     = require('chai-as-promised');
var BridgeQuoteService = require(__dirname + '/../../../../server/lib/services/bridge_quote_service.js');
var fixture            = require(__dirname + '/../../../fixtures/bridge_quote_requests.js');

describe('bridge_quote_service', function() {

  chai.use(chaiAsPromised);

  it('.validate() should successfully validate a bridge quote request', function(done) {
    BridgeQuoteService.validate(fixture.valid)
      .then(function(valid) {
        chai.assert.strictEqual(valid.destination.address, fixture.valid.destination_address);
        chai.assert.strictEqual(valid.destination.amount, 5.00);
        chai.assert.strictEqual(valid.destination.currency, 'USD');
        chai.assert.strictEqual(valid.source.address, fixture.valid.source_address);
        done();
      })
      .catch(done);
  });

  it('.validate() should fail because of an invalid (amount)', function() {
    return chai.assert.isRejected(BridgeQuoteService.validate(fixture.invalid.amount), 'Amount is not valid');
  });

  it('.validate() should fail because of an invalid (destination_address)', function() {
    return chai.assert.isRejected(BridgeQuoteService.validate(fixture.invalid.destination_address), 'Destination address is not a valid ripple address');
  });

  it('.validate() should fail because of an invalid (source_address)', function() {
    return chai.assert.isRejected(BridgeQuoteService.validate(fixture.invalid.source_address), 'Source address is not a valid ripple address');
  });

  it('.build() should fail because an invalid amount and validate fails', function() {
    return chai.assert.isRejected(BridgeQuoteService.build(fixture.invalid.amount), 'Amount is not valid');
  })
});