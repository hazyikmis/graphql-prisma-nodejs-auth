// const Comment = {
//   author(parent, args, { db }, info) {
//     return db.users.find((user) => user.id === parent.author);
//   },
//   post(parent, args, { db }, info) {
//     return db.posts.find((post) => post.id === parent.post);
//   },
// };

const Comment = {
  //nothing to required to put something inside,
  //because graphql schema definition handles automatically the relations
  //in order to succeed in this: we need to send "info" parameter
  //this means info about all schema
  //THIS IS THE ONE GREAT REASON WHY WE USE PRISMA!!!
  //PRISMA DOING THE HEAVY LIFTING FOR US
};

//export default { Comment };
module.exports = { Comment };
//module.exports;
