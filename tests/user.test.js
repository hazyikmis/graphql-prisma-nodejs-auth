require("cross-fetch/polyfill");
//import ApolloBoost, { gql } from "apollo-boost";
const ApolloBoost = require("apollo-boost");
const { gql } = require("apollo-boost");

const { prisma } = require("../src/prisma");

const bcryptjs = require("bcryptjs");

const client = new ApolloBoost.default({
  uri: "http://localhost:4000",
});

beforeEach(async () => {
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.createUser({
    data: {
      name: "Jen",
      email: "jen@example.com",
      password: bcryptjs.hashSync("qqqqwwww"),
    },
  });
});

test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Andrew"
          email: "andrew@example.com"
          password: "qqqqwwww"
        }
      ) {
        token
        user {
          id
          name
          email
          password
        }
      }
    }
  `;

  const response = client.mutate({
    mutation: createUser,
  });

  const exist = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });

  expect(exists).toBe(true);
});
