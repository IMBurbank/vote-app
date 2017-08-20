let chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let expect = chai.expect,
    { app, collectionName, MongoClient, routes } = require('../server.js'),
    clickHandler = require('../app/controllers/clickHandler.server.js');

let appPort = 3000,
    dbName = 'testdb',
    testDb = 'mongodb://localhost:27017/' + dbName;


describe('clickHandler.server.js', function() {

  before(async function() {
    try {
      this.db = await MongoClient.connect(testDb);
      this.server = await app.listen(appPort);
      this.collection = this.db.collection(collectionName);

      console.log('DB connected to port, db: ', this.db.serverConfig.s.port, this.db.databaseName);
      console.log('Express listening on port ', this.server.address().port);
    }
    catch(err) { console.log(err) }
  });

  describe('#clickHandler', function() {
    it('should work');
  })

  after(function(done) {
    this.collection.drop();
    this.server.close()
    this.db.close(done)
  });
});
