var responseHandler = require(__dirname + '/../response-handler.js');
var BridgeQuoteService = require(__dirname + '/../../services/bridge_quote_service.js');

function getBridgeQuote(request, response, next) {
  BridgeQuoteService.build({
    source_address: request.param('sender'),
    destination_address: request.param('receiver'),
    amount: request.param('amount')
  }).then(function(bridgeQuote) {
    responseHandler.success(response, bridgeQuote);
  }).error(function(error) {
    // If it
    if (error.error_type === 'transaction') {
      responseHandler.transactionError(response, null, error);
    } else {
      responseHandler.invalidRequest(response, error.message);
    }
  })

}

module.exports.getBridgeQuote = getBridgeQuote;