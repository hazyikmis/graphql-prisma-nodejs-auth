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
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  ////resolvers object defined in "resolvers/index.js" and imported here
  // resolvers: {
  //   Query,
  //   Mutation,
  //   Subscription,
  //   User,
  //   Post,
  //   Comment,
  // },
  resolvers,
  // context: {
  //   db,
  //   pubsub,
  //   prisma,
  // },
  //context object changed to context function to access request
  //an be able to use http headers (authorization token etc.)
  context(request) {
    //console.log(request);
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
