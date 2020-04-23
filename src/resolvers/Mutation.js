//const { v4: uuidv4 } = require("uuid");  //no longer being used
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

/*
//---SHORT EXAMPLE OF JWT USAGE  -  START:
const token = jwt.sign({ id: 69 }, process.env.JWT_SECRET);
console.log(token);

//when decoding a token, everybody can decode and see the payload + iat (issued at) info - timestamp
//this is not secret...
const decoded = jwt.decode(token);
console.log(decoded);

//verify can be done only server (who knows the secret!)
const decoded2 = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded2);
//---SHORT EXAMPLE OF JWT USAGE  -  END:
*/

//In signin & login operations:
//1.Take in password --> 2.Validate password --> 3.Hash password --> 4.Generate auth token

//Now; think about signin (createUser mutation)
//1.Take in password: Done by adding "password" field inside the "CreateUserInput" defined in the schema.graphql
//2.Validate password (check length for example): Done inside the "createUser" mutation below
//3.Hash password: Done inside the "createUser" mutation below using bcryptjs npm pack.
//4.Generate auth token: Done by jwt.sign; we should create a token (jwt.sign) and return it to the user
//...This means that, rather than returning only the complete user object
//...we should also return the token, alongside the user object
//...So, createUser mutation has been changed accordingly. (And the schema of course!!!)
//Previous typDef: createUser(data: CreateUserInput!): User!
//New typDef: createUser(data: CreateUserInput!): AuthPayload!
//...and new created type:
// type AuthPayload {
//   token: String!
//   user: User!
// }
//...these typeDef changes done inside the schema.graphql file (means on the NodeJS side)
//CAUTION: After this new typDef changes, we removed the info argument from createUser mutation! (check the code + additional comments)

// //PASWORD CHECK - START
// const dummy = async () => {
//   const email = "halo@azy.com";
//   const password = "red12345";

//   const hashedPassword = "kljakjkldlkdaj.93803jj3hkj.jjlkl...";

//   const isMatch = await bcryptjs.compare(password, hashedPassword);
//   console.log(isMatch);
// };
// dummy();
// //PASWORD CHECK - END

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
    /*
    return await prisma.mutation.createUser(
      {
        data: {
          ...args.data,
          password: hashedPassword,
        },
      },
      info
    );
    */

    //CAUTION!!!
    //"info" parameter !!! REMOVED !!! from createUser mutation call
    //Because, we are not returning the GraphQL Server definition of createUser mutation
    //we are returning, completely different custom type object (AuthPayload), and this does not know by server
    //removing "info" argument helps us to run createUser mutation without an error!
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword,
      },
    });

    //console.log(user);

    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
    };
  },

  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error("Unable to login!");
    }

    const isMatch = await bcryptjs.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login!");
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
    };
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
