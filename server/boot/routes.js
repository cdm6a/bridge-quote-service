module.exports = function(server) {
  var router = server.loopback.Router();
  router.get('/ping', function(req, res) {
    res.status(200).send('pong');
  });
  server.use(router);
};
