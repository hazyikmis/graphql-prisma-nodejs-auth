/*
const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter((post) => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => comment.author === parent.id);
  },
};
*/

const User = {
  //nothing to required to put something inside,
  //because graphql schema definition handles automatically the relations
  //in order to succeed in this: we need to send "info" parameter
  //this means info about all schema
  //THIS IS THE ONE GREAT REASON WHY WE USE PRISMA!!!
  //PRISMA DOING THE HEAVY LIFTING FOR US
};

//export default { User };
module.exports = { User };
