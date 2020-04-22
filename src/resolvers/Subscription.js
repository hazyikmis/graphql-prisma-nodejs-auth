const Subscription = {
  count: {
    //subscribe(parent, args, ctx, info) {
    subscribe(parent, args, { pubsub }, info) {
      let counter = 0;

      setInterval(() => {
        counter++;
        pubsub.publish("countChannel", {
          count: counter,
        });
      }, 1000);

      return pubsub.asyncIterator("countChannel");
    },
  },

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

  post: {
    //whenever new post created this resolver method below sends it to the "posts" channel
    //be careful: no args, means all posts (from all authors)
    //be careful 2: cheking the publishing is true or false is done in createPost resolver method!
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator("post");
    },
  },
};

module.exports = { Subscription };
