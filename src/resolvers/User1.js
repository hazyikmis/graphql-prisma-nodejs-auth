/*
const User = {
  //DO NOT FORGET: "parent" IS THE USER OBJECT
  posts(parent, args, { db }, info) {
    return db.posts.filter((post) => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => comment.author === parent.id);
  },
};
*/
/*
const User = {
  //nothing to required to put something inside,
  //because graphql schema definition handles automatically the relations
  //in order to succeed in this: we need to send "info" parameter
  //this means info about all schema
  //THIS IS THE ONE GREAT REASON WHY WE USE PRISMA!!!
  //PRISMA DOING THE HEAVY LIFTING FOR US
};
*/

const { getUserId } = require("../utils/getUserId");

const User = {
  //this is an example of how to lock down individual fields
  //according to token, we can decide whether we send back email data or not
  //--Before adding the method below, we have changed the email field definition inside de User type like below:
  //email: String! --> email: String
  //because, in some cases we need to return null
  email(parent, args, { request }, info) {
    // return null;
    // return "some@static.value";

    const userId = getUserId(request, false);

    //console.log(parent);

    if (userId && userId === parent.id) {
      //this condition returns users only their own email info, not the others' emails
      return parent.email;
    } else {
      return null;
    }
  },
};

//export default { User };
module.exports = { User };
