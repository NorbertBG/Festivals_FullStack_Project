const http = require('http');
const app = require("./app");

const express = require("express");
const dotenv = require("dotenv");


dotenv.config();
 

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
