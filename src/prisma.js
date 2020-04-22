//import { Prisma } from "prisma-binding";
const { Prisma } = require("prisma-binding");

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

module.exports = { prisma };
