//import { Prisma } from "prisma-binding";
const { Prisma } = require("prisma-binding");

require("dotenv").config();

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: process.env.PRISMA_SECRET,
});

module.exports = { prisma };
