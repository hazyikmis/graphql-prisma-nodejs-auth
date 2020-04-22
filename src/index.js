//import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer, PubSub } = require("graphql-yoga");

const { Query } = require("./resolvers/Query");
const { Mutation } = require("./resolvers/Mutation");
const { Subscription } = require("./resolvers/Subscription");
const { User } = require("./resolvers/User");
const { Post } = require("./resolvers/Post");
const { Comment } = require("./resolvers/Comment");

const db = require("./db");

//require("./prisma");
const { prisma } = require("./prisma");

const pubsub = new PubSub();

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

server.start(() => {
  console.log("The server is up");
});

/*
subscription {
  count
}

//if you create a new comment for post 12, then you will get that comment instantly with the subscription below
subscription {
  comment(postId:"12") {
    id
    text
    author {
      id
      name
    }
  }
}

subscription {
  post {
    id
    title
    body
    author {
      id
      name
    }
  }
}

subscription {
  post {
    mutation
    data {
			id
      title
      body
      published
      author {id name}
    }
  }
}
*/
