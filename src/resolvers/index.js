const { extractFragmentReplacements } = require("prisma-binding");

const { Query } = require("./Query");
const { Mutation } = require("./Mutation");
const { Subscription } = require("./Subscription");
const { User } = require("./User");
const { Post } = require("./Post");
const { Comment } = require("./Comment");

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Comment,
};

//this index.js file created for just the one line code below
//we need to use fragments before creating server = new GraphQLServer({...})
//so we moved everything related to resolvers from index.js to here
//made the replacements and then back, imported resolvers object backt to index.js to be used when creating server...
const fragmentReplacements = extractFragmentReplacements(resolvers);

module.exports = { resolvers, fragmentReplacements };
