//Locking Queries (checking the user using request authorization token)
//is a little complex, moe complex than mutations. Because, in mutations
//you can do (create, update, delete) something or not. But in queries,
//according to user, queries required to behave differently!

const { getUserId } = require("../utils/getUserId");

const Query = {
  hello() {
    console.log("xxx");
    return "Hello GraphQL";
  },
  //me query is completely private

  me(parent, args, { prisma, request }, info) {
    //console.log("xxx");
    const userId = getUserId(request);
    return prisma.query.user({
      where: {
        id: userId,
      },
    });
  },

  async post(parent, args, { prisma, request }, info) {
    //we are trying to detect the "post" request/query coming from an authenticated user or not!
    const userId = getUserId(request, false);
    //by sending 2nd argument "requireAuth=false", provides us to not throw an error inside the getUserId method
    //allows userId just being "undefined"

    //Now at this point, with the addition of "requireAuth=false"
    //we have 2 possibilities: 1.userId="something" 2.userId=undefined

    //Normally, GraphQL Server (localhos:4466) has a "post" query
    //But we are trying to take the advantage of using "posts" query.
    //Because, in "post" query, you can make a query only with id
    //But we need more complex query...
    //Our purpose is to return a post to everyone if it's published or if not published then return it only to owner
    const posts = await prisma.query.posts(
      {
        where: {
          id: parseInt(args.id),
          OR: [
            {
              published: true,
            },
            {
              author: {
                id: userId,
              },
            },
          ],
        },
      },
      info
    );

    if (posts.length === 0) {
      throw new Error("Post not found!");
    }

    return posts[0];
  },

  //usersByName(parent, args, { db }, nfo) {
  users(parent, args, { prisma }, info) {
    //return prisma.query.users(null, info); //retrieves all SCALAR fields' data
    //const opArgs = {};
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.query) {
      // opArgs.where = {
      //   name_contains: args.query,
      // };
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
          {
            email_contains: args.query,
          },
        ],
      };
    }
    return prisma.query.users(opArgs, info);
    //console.log(prisma);
    //the code below retrieves info from static db.js
    /*
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
    */
  },

  usersByName(parent, args, { db }, nfo) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },

  usersByQuery(parent, args, { db }, nfo) {
    console.log("xxx");
    if (!args.id && !args.name && !args.email && !args.age) {
      return db.users;
    }
    return db.users.filter((user) => {
      return (
        (!args.id || user.id === args.id) &&
        (!args.name || user.name.toLowerCase() === args.name.toLowerCase()) &&
        (!args.age || user.age === args.age) &&
        (!args.email || user.email.toLowerCase() === args.email.toLowerCase())
      );
    });
  },

  //posts(parent, args, { db }, info) {
  posts(parent, args, { prisma }, info) {
    //the code below retrieves info from real database accessed via GraphQL (run on docker)
    //return prisma.query.posts(null, info); //retrieves all SCALAR fields' data

    //default opArgs
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        published: true,
      },
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return prisma.query.posts(opArgs, info);
  },

  async myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.sortBy,
      where: {
        author: {
          id: userId,
        },
      },
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return await prisma.query.posts(opArgs, info);
  },

  //comments(parent, args, { db }, info) {
  //comments query is completely public
  comments(parent, args, { prisma }, info) {
    //no arguments defined in comments query, check schema.graphql
    //return prisma.query.comments(null, info);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };
    return prisma.query.comments(opArgs, info);
  },
};

//module.exports = { Query };
module.exports = { Query };
//module.exports;
