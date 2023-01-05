const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017";
class LocalDb {
    constructor () {
        this.client = new MongoClient(uri);
        this.db = this.client.db('testdb');
        this.last2 = this.db.collection('l2m');
        this.teams = this.db.collection('teams');
    }
    async connect() {
        await mongoose.connect(mongoPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
    }

    async find(q) {
        return await this.last2.find(q).toArray();
    }

    async getTeams(q, p) {
        return await this.teams.find(q).project(p).toArray();
    }
}

module.exports = LocalDb;