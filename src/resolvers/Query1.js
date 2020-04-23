const Query = {
  hello() {
    console.log("xxx");
    return "Hello GraphQL";
  },
  me() {
    console.log("xxx");
    return {
      id: "123-2390-aa",
      name: "Mike",
      email: "mike@com.be",
    };
  },
  //usersByName(parent, args, { db }, nfo) {
  users(parent, args, { prisma }, info) {
    //return prisma.query.users(null, info); //retrieves all SCALAR fields' data
    const opArgs = {};
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
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query,
          },
          {
            body_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.posts(opArgs, info);
    //the code below retrieves info from static db.js
    /*
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase());
      const isBodyMatch = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase());
      return isTitleMatch || isBodyMatch;
    });
    */
  },
  //comments(parent, args, { db }, info) {
  comments(parent, args, { prisma }, info) {
    //no arguments defined in comments query, check schema.graphql
    return prisma.query.comments(null, info);
  },
};

//module.exports = { Query };
module.exports = { Query };
//module.exports;
