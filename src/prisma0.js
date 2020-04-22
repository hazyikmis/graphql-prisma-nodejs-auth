//import { Prisma } from "prisma-binding";
const { Prisma } = require("prisma-binding");

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

//now we can access prisma.query prisma.mutation prisma.subscriptions and prisma.exists
//all these comes from prisma-binding npm pack (https://www.npmjs.com/package/prisma-binding)

//all prisma queries accepts 2 arguments: 1st whereClause, 2nd selectionSet

/*
//prisma.query.users({ where: { name: "mia" } }, "{ id name email }").then((data) => {
prisma.query
  //.users(null, "{ id name email }")
  .users(null, "{ id name email posts { id title } }")
  .then((data) => {
    //console.log(data);
    console.log(JSON.stringify(data, undefined, 2));
  });

prisma.query
  .comments(null, "{ id text author { id name email } }")
  .then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
  });
*/

/*
prisma.mutation
  .createPost(
    {
      data: {
        title: "GraphQL 777",
        body: "xxx - You can find new course in udemy",
        published: true,
        author: {
          connect: {
            id: "ck98yu2j900qr07098f5jgijq",
          },
        },
      },
    },
    "{ id title body published }"
  )
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  });
*/

//promise chaining
prisma.mutation
  .createPost(
    {
      data: {
        title: "Redux 102",
        body: "xxx - You can find new course in udemy",
        published: true,
        author: {
          connect: {
            id: "ck98yu2j900qr07098f5jgijq",
          },
        },
      },
    },
    "{ id title body published }"
  )
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
    prisma.query
      .users(
        { where: { id: "ck98yu2j900qr07098f5jgijq" } },
        "{ id name email posts { id title } }"
      )
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));
      });
  });
