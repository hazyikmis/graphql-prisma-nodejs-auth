// require("babel-register");
// require("@babel/polyfill/noConflict");

const { server } = require("../../src/server");
module.exports = async () => {
  // const instance  = await server.start({ port: 4000 });
  // instance.close() //should be run on globalTeardown.js. But how to reach instance?
  global.httpServer = await server.start({ port: 4000 });
};
