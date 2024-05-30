const mongodb = require("mongodb");
const { ObjectId } = require("mongodb");

const mongoclient = new mongodb.MongoClient("mongodb://127.0.0.1:27017");

let database = null;

async function initialize() {
  await mongoclient.connect();

  database = mongoclient.db("read-through-cache");
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
    { $set: updateDetails }
  );
}

async function insertUser(userDetails) {
  return getCollection("user").insertOne(userDetails);
}

module.exports = { initialize, getUser, updateUser, insertUser };
