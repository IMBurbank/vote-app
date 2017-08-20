

let chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let expect = chai.expect,
    { app, MongoClient, routes } = require('../server.js'),
    clickHandler = require('../app/controllers/clickHandler.server.js');

let appPort = 3000,
    dbName = 'testdb',
    testDb = 'mongodb://localhost:27017/' + dbName;


describe('Check basic server connections', function() {

  describe('Database can connect properly to ' + dbName, function() {
    before(async function() {
      this.db = await MongoClient.connect(testDb);
    });

    it('should be an object', function() {
      expect(this.db).to.be.a('object');
    });
    it('should be connected to port 27017', function() {
      expect(this.db.serverConfig.s.port).to.equal(27017);
    });
    it('should have database name ' + dbName, function() {
      expect(this.db.databaseName).to.equal(dbName);
    });

    after(function(done) {
      this.db.close(done);
    });
  });

  describe('#app can listen properly', function() {
    before(async function() {
      this.server = await app.listen(appPort);
    });

    it('server should be an object', function() {
      expect(this.server).to.be.a('object');
    });
    it('server should be connected to port ' + appPort, function() {
      expect(this.server.address().port).to.equal(appPort);
    });

    after(function(done) {
      this.server.close(done);
    });
  });
});
