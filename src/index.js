const express = require("express");

const database = require("./database.service");

const cacheService = require("./cache.service");

async function start() {
  console.log("starting server...");

  console.log("server started..");
  console.log("initializing database...");

  await database.initialize();

  console.log("connected to database..");

  const server = express();

  server.use(express.json());

  server.get("/users", getUser);
  server.put("/users/:id", updateUser);

  server.listen(3090, () => {
    console.log("server is connected to port", 3090);
  });
}

start().catch((err) => {
  console.log("[fatal]: could not start the server", err);
});

async function getUser(req, res) {
  const { id } = req.body;

  let result = await cacheService.get(id);

  if (result) {
    res.json({
      success: true,
      data: result,
    });
    return;
  }

  res.json({
    success: false,
    message: `id - '${id}' not found.`,
  });
}

async function updateUser(req, res) {
  const { id } = req.params;
  const updateDetails = req.body;

  await database.updateUser(id, updateDetails);
  cacheService.invalidate(id);  

  res.json({
    success: true,
    data: "user details updated.",
  });
  return;
}
