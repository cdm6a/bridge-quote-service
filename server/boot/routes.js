module.exports = function(server) {
  var router = server.loopback.Router();
  router.get('/ping', function(req, res) {
    res.send(200, 'pong');
  });
  server.use(router);
};
