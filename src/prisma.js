//import { Prisma } from "prisma-binding";
const { Prisma } = require("prisma-binding");

const { fragmentReplacements } = require("./resolvers/index");

require("dotenv").config();

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements,
});

module.exports = { prisma };
