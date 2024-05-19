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

async function get(key = "") {
  if (Reflect.has(cacheStore, key)) {
    return cacheStore[key];
  }

  const result = await database.getUser(key);

  if (result) {
    const cacheStoreMemStatus = checkCacheStoreSize();
    if (cacheStoreMemStatus) {
      deleteStaleCache();
    }
    set(result._id.toString(), result);
    return result;
  }
}

async function invalidate(key = "") {
  if (Reflect.has(cacheStore, key)) {
    delete cacheStore[key];
    console.log("invalidate cache store -", cacheStore);
  }
}

function checkCacheStoreSize(length = 3) {
  return Object.keys(cacheStore).length >= length;
}

function deleteStaleCache() {
  delete cacheStore[Object.keys(cacheStore)[0]];
}

module.exports = {
  set,
  get,
  invalidate,
};
