var BridgeQuoteController = require(__dirname + '/../lib/api/controllers/bridge_quote_controller.js');

module.exports = function(server) {
  var router = server.loopback.Router();
  router.get('/quotes/:sender/:receiver/:amount', BridgeQuoteController.getBridgeQuote);
  server.use(router);
};
