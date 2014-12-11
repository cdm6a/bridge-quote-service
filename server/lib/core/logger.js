var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'info',
      colorize: true,
      timestamp: true
    }),
    new (winston.transports.DailyRotateFile)({
      filename: __dirname + '/../../../logs/bridge_quote_service.log',
      level: 'warn',
      datePattern: '.yyyy-MM-dd',
      colorize: true,
      timestamp: true
    })
  ]
});

module.exports = logger;
