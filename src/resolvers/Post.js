// const Post = {
//   author(parent, args, { db }, info) {
//     return db.users.find((user) => user.id === parent.author);
//   },
//   comments(parent, args, { db }, info) {
//     return db.comments.filter((comment) => comment.post === parent.id);
//   },
// };

const Post = {
  //nothing to required to put something inside,
  //because graphql schema definition handles automatically the relations
  //in order to succeed in this: we need to send "info" parameter
  //this means info about all schema
  //THIS IS THE ONE GREAT REASON WHY WE USE PRISMA!!!
  //PRISMA DOING THE HEAVY LIFTING FOR US
};

//export default { Post };
module.exports = { Post };
//module.exports;
