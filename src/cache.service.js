const database = require("./database.service");

let cacheStore = {};

async function set(key = "", value = {}) {
  const cacheStoreMemStatus = checkCacheStoreSize();
  if (cacheStoreMemStatus) {
    deleteStaleCache();
  }
  cacheStore[key] = value;
  console.log("cache store -", cacheStore);
}

async function getUser(key = "") {
  let result = getUserFromCache(key);

  if (result) {
    return result;
  }

  result = await getUserFromDB(key);

  if (result) {
    set(result._id.toString(), result);
    return result;
  }
}

function getUserFromCache(key = "") {
  if (Reflect.has(cacheStore, key)) {
    return cacheStore[key];
  }
}

async function getUserFromDB(key) {
  const result = await database.getUser(key);

  return result;
}

function checkCacheStoreSize(length = 3) {
  return Object.keys(cacheStore).length >= length;
}

function deleteStaleCache() {
  delete cacheStore[Object.keys(cacheStore)[0]];
}

module.exports = {
  set,
  getUser,
};
