const { getUserId } = require("../utils/getUserId");

const Subscription = {
  /*
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(
        (post) => post.id === postId && post.published
      );

      if (!post) {
        throw new Error("Post not found!");
      }

      return pubsub.asyncIterator(`comment ${postId}`);

      //publishing is done when new comment created (check Mutation resolver)
    },
  },
  */
  comment: {
    subscribe(parent, args, { prisma }, info) {
      //data flow: Prisma --> NodeJS --> Client (GraphQL Playground)
      //schema.graphql has changed to understand NodeJS & GraphQL each other better
      //for example, the returning data in the CommentSubscriptionPayload, its name changed to "node",
      //because its named "node" in the GraphQL !!!

      //without operation argumnets we subscribe all comments (without "where")
      //return prisma.subscription.comment(null, info);

      //its possible to subscribe only for DELETE mutations --> "mutation_in"
      //or change of specific field(s) --> "updateFields_contains"
      //if we want to subscribe for specific data rather than the aboves, we nned to use "node"
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: parseInt(args.postId),
              },
            },
          },
        },
        info
      );
    },
  },

  /*
  post: {
    //whenever new post created this resolver method below sends it to the "posts" channel
    //be careful: no args, means all posts (from all authors)
    //be careful 2: cheking the publishing is true or false is done in createPost resolver method!
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator("post");
    },
  },
*/

  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post(
        {
          where: {
            node: {
              published: true,
            },
            mutation_in: ["CREATED"],
          },
        },
        info
      );
    },
  },
  myPost: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserId(request);
      //BE CAREFUL: Subscriptions are different from Query & Mutations
      //Becasue Query & Mutations use HTTP, but Subscriptions use WEBSOCKETs
      //As a result of this, we need to make change inside the getUserId method
      //in order to extract token correctly from request object

      return prisma.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId,
              },
            },
          },
        },
        info
      );
    },
  },
};

module.exports = { Subscription };
