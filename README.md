IN THIS PROJECT NodeJs App, queries, and makes CRUD Operations on real database, served by GraphQL --> PostgreSQL, not db.js (satatic data)
In doing that, it uses the "prisma".

1. http://spec.graphql.org/
   2.The GraphQL server for NodeJS: graphql-yoga
   https://www.npmjs.com/package/graphql-yoga
   NOTE: Previously "graphql" & "express-graphql" npm-packs tried in other previous projects
   3.Creating a simple API
   ----------- index.js file contents ---------- start----
   //import { GraphQLServer } from "graphql-yoga";
   const { GraphQLServer } = require("graphql-yoga");

//Type definitions (schema)
const typeDefs = `type Query { hello: String! name: String! location: String! }`;

//Resolvers
const resolvers = {
Query: {
hello() {
return "This is my first query!";
},
name() {
return "Halil Azy";
},
location() {
return "Leuven 3000";
},
},
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
console.log("The server is up");
});
----------- index.js file contents ---------- end----

In the terminal run your app by typing "node index.js"
check the browser: http://localhost:4000
Finally you can test your API: by typing the below query onto the left panel:
query {
hello,
name,
location
}

4.Scalar Types: String, Boolean, Number, Float, ID
5.Collection Types: Array ([]), Object ({})
7.Custom Types: User, Post, Comment, Product, etc.

8.If you want to run your app on "babel-node", you need to specify this in package.json:
"start": "nodemon src/index.js --exec babel-node"

9.typeDefs moved to "schema.graphql"
And server definition at the end of index.js changed accordingly:
const server = new GraphQLServer({
typeDefs: "./src/schema.graphql",
resolvers,
});
Also "nodemon" script in package.json changed accordingly to detect changes on schema:
"dev": "nodemon src/index.js -e js,graphql",

10. Subscription:
    Subscriptions use web sockets behind the scenes which keeps an open channel of communication between the client and the server. That means the server can send the latest changes to the client in real time. This is super useful for chat apps real time ordering applications where notifications are important!

11.Prisma comes into play:

> npm install -g prisma
> prisma init prisma
> -use existing database
> -PostgreSQL
> -No
> -...enter the connection info from heroku (azy-prisma-dev-server, add-ons/Heroku PostgreSQL > settings/credentials)
> -SSL: Yes
> -Select Prog.lang for Prisma Client: Don't generate
> ....That's all.... (created 3 files inside the prisma directory)... commands:

- To start Prisma server: docker-compose up -d
- To deploy Prisma service: prisma deploy
  IF YOU USE PRISMA, IT'S ENOUGH TO DEFINE DATAMODEL/SCHEMA (TYPEDEFS). ALL THE REMAINING MUTATIONS (INSERT/UPDATE/DELETE MUTATIONS AND ALSO SUBSCRIPTIONS CREATED AUTOMATICALLY BY PRISMA - in the docker graphql server, you can see/check/use them from the Playground GraphQL page by which you can access from http://localhost:4466/)

NOTE: schema.graphql (the file we have created by ourselves and defined all types, including all queries, mutations, subscriptions etc manually) IS NOT SAME WITH datamodel.prisma (initially created by prisma and then we defined just the model not all queries, mutations and subscriptions). SO, WE CANNOT USE datamodel.prisma IN PLACE OF schema.graphql

12.prisma-binding (https://www.npmjs.com/package/prisma-binding)
GraphQL Binding for Prisma (using GraphQL schema delegation)
For working with prisma in NodeJS, you need to install this npm pack (?)

> npm i prisma-binding
> After installation, create "prisma.js" file under the src folder. In this file you will define to access Prisma server.

13.grapql-cli (https://www.npmjs.com/package/graphql-cli)
Command line tool for common GraphQL development workflows...
This tool JUST required for fetching the schema from GraphQL Server. (with the "graphql get-schema" command) BEFORE FETCHING THAT FILE, WE ARE CREATING ".graphqlconfig" on the ROOT folder. AND creating "generated" folder under the "src" folder. To fetch the schema we have added the script below, inside the package.json:
"get-schema": "graphql get-schema -p prisma"
By doing all these steps, we can download the schema by typing "npm run get-schema" and store it under the "src/generated" folder with the name "prisma.graphql". (This last info designed in the ".graphqlconfig" file)

JUST TO INFORM YOU that, in the "Playground GraphQL" there is TABs named "Schema" & "Docs", and here you can see and copy all schema...
