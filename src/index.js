//import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer, PubSub } = require("graphql-yoga");

//all resolvers below moved to the "resolvers/index.js"
// const { Query } = require("./resolvers/Query");
// const { Mutation } = require("./resolvers/Mutation");
// const { Subscription } = require("./resolvers/Subscription");
// const { User } = require("./resolvers/User");
// const { Post } = require("./resolvers/Post");
// const { Comment } = require("./resolvers/Comment");

const db = require("./db");

//require("./prisma");
const { prisma } = require("./prisma");

const pubsub = new PubSub();

const { resolvers, fragmentReplacements } = require("./resolvers/index");

//"src/schema.graphql" is similar but not the same with "prisma/datamodel.prisma"
//schema.graphql used by NodeJS app, as referencing below
//but datamodel.prisma used by GraphQL Server, when deploying the model

/*
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  context: {
    db,
    pubsub,
    prisma,
  },
});
*/

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request,
    };
  },
  fragmentReplacements,
});

//ALTTAKI YONTEM DE OLUR
/*
const qry = require("./resolvers/Query");
const mut = require("./resolvers/Mutation");
const usr = require("./resolvers/User");
const post = require("./resolvers/Post");
const cmt = require("./resolvers/Comment");

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query: qry.Query,
    Mutation: mut.Mutation,
    User: usr.User,
    Post: post.Post,
    Comment: cmt.Comment,
  },
  context: {
    db,
  },
});
*/

//heroku internally assigns a PORT to each app
//you should not define the PORT, otherwise you'll get an error from heroku
//server.start(() => {
server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("The server is up");
});
