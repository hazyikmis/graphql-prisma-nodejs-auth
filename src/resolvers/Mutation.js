//const { v4: uuidv4 } = require("uuid");  //no longer being used
const bcryptjs = require("bcryptjs");

//In signin & login operations:
//1.Take in password --> 2.Validate password --> 3.Hash password --> 4.Generate auth token

//Now; think about signin (createUser mutation)
//1.Take in password: Done by adding "password" field inside the "CreateUserInput" defined in the schema.graphql
//2.Validate password (check length for example): Done inside the "createUser" mutation below
//3.Hash password: Done inside the "createUser" mutation below using bcryptjs npm pack.
const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    //is it also possible to not check "exists" and send data to prisma and wait for if any error!
    if (emailTaken) {
      throw new Error("Email taken!");
    }

    if (args.data.password.length < 8) {
      throw new Error("Password must be 8 characters or longer!");
    }

    const hashedPassword = await bcryptjs.hash(args.data.password, 10);
    //console.log(hashedPassword);
    //return await prisma.mutation.createUser({ data: args.data }, info);
    return await prisma.mutation.createUser(
      {
        data: {
          ...args.data,
          password: hashedPassword,
        },
      },
      info
    );
  },

  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw new Error("User not found!");
    }

    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },

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

  async createPost(parent, args, { prisma }, info) {
    const userExist = await prisma.exists.User({ id: args.data.author });

    if (!userExist) {
      throw new Error("User not found!");
    }

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

  async deleteComment(parent, { id }, { prisma }, info) {
    const commentExists = await prisma.exists.Comment({ id });

    if (!commentExists) {
      throw new Error("Comment not found!");
    }

    return await prisma.mutation.deleteComment({ where: { id } }, info);
  },

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
