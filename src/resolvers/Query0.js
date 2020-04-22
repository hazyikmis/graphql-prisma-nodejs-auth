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
  users(parent, args, { db, prisma }, info) {
    //the code below retrieves info from real database accessed via GraphQL (run on docker)
    return prisma.query.users(null, info); //retrieves all SCALAR fields' data
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
  //usersByQuery(parent, args, { db }, nfo) {
  usersByQuery(parent, args, { db, prisma }, nfo) {
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
  posts(parent, args, { db, prisma }, info) {
    //the code below retrieves info from real database accessed via GraphQL (run on docker)
    return prisma.query.posts(null, info);
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
  comments(parent, args, { db, prisma }, info) {
    return db.comments;
  },
};

//module.exports = { Query };
module.exports = { Query };
//module.exports;
