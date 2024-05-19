const mongodb = require("mongodb");
const { ObjectId } = require("mongodb");

const mongoclient = new mongodb.MongoClient("mongodb://127.0.0.1:27017");

let database = null;

async function initialize() {
  await mongoclient.connect();

  database = mongoclient.db("iternary-builder");
}

function getCollection(collectionName) {
  return database.collection(collectionName);
}

async function getUser(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  return getCollection("user").findOne({ _id: new ObjectId(id) });
}

async function updateUser(id, updateDetails) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  return getCollection("user").updateOne(
    {
      _id: new ObjectId(id),
    },
    { $set:  updateDetails  }
  );
}

module.exports = { initialize, getCollection, getUser, updateUser };
