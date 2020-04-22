const { v4: uuidv4 } = require("uuid");

const Mutation = {
  //createUser(parent, args, { db }, info) {
  async createUser(parent, args, { prisma }, info) {
    //const emailTaken = db.users.some((user) => user.email === args.data.email);
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    //is it also possible to not check "exists" and send data to prisma and wait for if any error!
    if (emailTaken) {
      throw new Error("Email taken!");
    }

    // const newUser = {
    //   id: uuidv4(),
    //   ...args.data,
    // };

    // db.users.push(newUser);

    //return newUser;

    return await prisma.mutation.createUser({ data: args.data }, info);
  },

  /*
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not found!");
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    //delete the posts which belongs to deletedUser and the comments which belongs to that deleted posts
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });

    //delete the comments which belongs to deletedUser
    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },
*/
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw new Error("User not found!");
    }

    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },

  /*
//updateUser(parent, args, { db }, info) {
  //  const {id, data} = args;
  updateUser(parent, { id, data }, { db }, info) {
    //console.log("xxx");
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found!");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email taken!");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
*/

  /*
async updateUser(parent, args, { prisma }, info) {
  return await prisma.mutation.updateUser(
    {
      where: {
        id: args.id
      },
      data: args.data
    },
    info
  );
},
*/

  //more simplifed version
  async updateUser(parent, { id, data }, { prisma }, info) {
    //you can check prisma.exists.User... if you want...
    return await prisma.mutation.updateUser(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },

  //createPost(parent, args, { db, pubsub }, info) {
  async createPost(parent, args, { prisma }, info) {
    // const userExist = db.users.some((user) => user.id === args.data.author);
    const userExist = await prisma.exists.User({ id: args.data.author });

    if (!userExist) {
      throw new Error("User not found!");
    }

    // const newPost = {
    //   id: uuidv4(),
    //   ...args.data,
    // };

    // db.posts.push(newPost);

    //NO NEED TO THINK ABOUT SUBSCRIPTIONS IN PRISMA!!!
    //AUTOMATICALLY DONE, NO NEED TO SEND/RECEIVE "pubsub"
    // if (newPost.published) {
    //   //pubsub.publish("post", { post: newPost });
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "CREATED",
    //       data: newPost,
    //     },
    //   });
    // }

    // return newPost;

    //if we had not checked the userExist, then just the ONE LINE code below is enough to create a post!!!
    return await prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author,
            },
          },
        },
      },
      info
    );
  },

  /*  
  updatePost(parent, args, { db, pubsub }, info) {
    //  const {id, data} = args; //could be better!!! DEFINITELY!!!
    const post = db.posts.find((post) => post.id === args.id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found!");
    }

    if (typeof args.data.title === "string") {
      post.title = args.data.title;
    }

    if (typeof args.data.body === "string") {
      post.body = args.data.body;
    }

    if (typeof args.data.published === "boolean") {
      post.published = args.data.published;

      if (originalPost.published && !post.published) {
        //deleted (published: changed from true to false )
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        //cretaed (published: changed from false to true )
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      //updated
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  */

  async updatePost(parent, args, { prisma }, info) {
    //you can check prisma.exists.Post... if you want...
    const postExists = await prisma.exists.Post({ id: parseInt(args.id) });
    if (!postExists) {
      throw new Error("Post not found!");
    }

    return await prisma.mutation.updatePost(
      {
        where: {
          id: parseInt(args.id),
        },
        data: args.data,
      },
      info
    );
  },

  /*
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found!");
    }
    //const deletedPosts = db.posts.splice(postIndex, 1);
    const [deletedPost] = db.posts.splice(postIndex, 1); //destructuring, since we sure there is only 1 element in the array

    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    //if (deletedPosts[0].published) {
    if (deletedPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          //data: deletedPosts[0],
          data: deletedPost,
        },
      });
    }

    //return deletedPosts[0];
    return deletedPost;
  },
*/
  async deletePost(parent, args, { prisma }, info) {
    const postExists = await prisma.exists.Post({ id: parseInt(args.id) });
    if (!postExists) {
      throw new Error("Post not found!");
    }

    return await prisma.mutation.deletePost(
      { where: { id: parseInt(args.id) } },
      info
    );
  },

  /*
  createComment(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    const postExist = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExist) {
      throw new Error("User not found!");
    }

    if (!postExist) {
      throw new Error("Post not found!");
    }

    const newComment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(newComment);

    //pubsub.publish(`comment ${args.data.post}`, { comment: newComment });
    //if I had used "comment" in place of "newComment", the code above might be shorter:
    //pubsub.publish(`comment ${args.data.post}`, {comment})
    pubsub.publish(`comment ${args.data.post}`, {
      comment: { mutation: "CREATED", data: newComment },
    });

    return newComment;
  },
*/

  async createComment(parent, args, { prisma }, info) {
    return await prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author,
            },
          },
          post: {
            connect: {
              id: parseInt(args.data.post),
            },
          },
        },
      },
      info
    );
  },

  /*
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found!");
    }
    // const deletedComments = db.comments.splice(commentIndex, 1);
    // return deletedComments[0];
    const [deletedComment] = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: { mutation: "DELETED", data: deletedComment },
    });
    return deletedComment;
  },
*/

  async deleteComment(parent, { id }, { prisma }, info) {
    const commentExists = await prisma.exists.Comment({ id });

    if (!commentExists) {
      throw new Error("Comment not found!");
    }

    return await prisma.mutation.deleteComment({ where: { id } }, info);
  },

  /*
  updateComment(parents, args, ctx, info) {
    const { id, data } = args;
    const { db, pubsub } = ctx;

    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found!");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: "UPDATED", data: comment },
    });

    return comment;
  },
*/

  async updateComment(parents, args, ctx, info) {
    const { id, data } = args;
    const { prisma } = ctx;

    const commentExists = await prisma.exists.Comment({ id });

    if (!commentExists) {
      throw new Error("Comment not found!");
    }

    return await prisma.mutation.updateComment(
      {
        data: {
          text: data.text,
        },
        where: {
          id,
        },
      },
      info
    );
  },
};

module.exports = { Mutation };
//module.exports = {};
//module.exports;
