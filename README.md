DEPLOYING:
requirements:
-->1-Production database
-->2-Host our Prisma docker container
-->3-Host our NodeJS app
(A-Heroku: has capability to meet all the needs above, for example, for database requirements, it has 3rd party add-on solutions seamlessly integrated with heroku
B-Prisma Cloud: (Prisma 1 Cloud) (https://app.prisma.io/) Helps us to manage prisma instances)
//-----------------

----here is the prisma.yml----start
#endpoint: http://localhost:4466
endpoint: \${env:PRISMA_ENDPOINT}
datamodel: datamodel.prisma
secret: thisIsMySu......
----here is the prisma.yml----end

//-----------------

#endpoint: is the docker container running on our machine
#if we "prisma deploy", it always deploys to that endpoint
#we need to switch between development & production deployments to different endpoints
#(to make it short "endpoint" should be dynamic)
#We have created "/config" folder and created 2 config files for dev & prod separately
#AFTER ALL THESE CHANGES, WE NEED TO DEFINE WHICH env config FILE SHOULD BE USED WHEN DEPLOYING
#-->prisma deploy -e ../config/dev.env

//-----------------

On the terminal, ">prisma login" works very similarly heroku... It logs you into the https://app.prisma.io/ from the command line.

//-----------------

> prisma deploy -e ../config/prod.env

(IMPORTANT! You need to exec "prisma login" before to deploy your app prod on https://app.prisma.io/)
If you exec this command with the blank prod.env--->The prisma asks you to which server do you want to use or set up a new prisma server? And your service name and stage names all you decide by answering questions... At the end of deployment the new prod "endpoint" written inside the "prisma.yml". You must remove that info from there -leave it as: "endpoint: \${env:PRISMA_ENDPOINT}"- and copy it into the prod.env. This is the first time process (required to create the server and get the endpoint address). After this first time, for the consecutive deploys, just run the "prisma deploy -e ../config/prod.env"

//-----------------

We have 2 endpoints: localhost:4466 & localhost:4000
localhost:4000 created and served by NodeJS app, but localhost:4466 created and served by GraphQL Server from docker container. If we define "secret" in the "prisma/prisma.yml" file and then redeploy our app to localhost:4466, its not possible to make queries, mutations, etc from it. And also from localhost:4000. But if we define this secret in the NodeJS app (prisma.js) when defining the prisma (binding), it's possible to communicate with localhost:4000, but still not possible to communicate localhost:4466 on the Playground GraphQL. If we want to test something or work on schema/docs directly on localhost:4466 (GraphQL Server), we need to create token and use it on localhost:4466 Playground. We can create token by typing "prisma token" on the terminal under the "project/prisma" folder. It shows the token. And then, we can use this token int he playground by adding HTTP HEADERS:

> {
> "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...."
> }

##-------

"src/schema.graphql" is similar but not the same with "prisma/datamodel.prisma"
schema.graphql used by NodeJS app, as referencing below
but datamodel.prisma used by GraphQL Server, when deploying the model

##-------

After adding "password" field to User inside the datamodel.prisma file, we need to delete and redeploy the model by typing "prisma delete" and then "prisma deploy". (I AM NOT SURE TO DELETE THE WHOLE SCHEMA, IT WOULD WORK IF WE DELETE JUST THE USERS TABLE ON THE DATABASE...maybe references between the tables might be problem!!!)
After that we need to get-schema again (>npm run get-schema) to replace the file "src/generated/prisma.graphql"
BUUUUT this command does not work! Because we have locked GraphQL Server (localhost:4466) (by adding secret into the prisma/prisma.yml). To solve this problem, we are adding a "key":"value" into the file ".graphqlconfig".
Under the extensions (add the pair below):
"prisma": "prisma/prisma.yml"
By adding this, we are telling NodeJS app that, you can use the "secret" info or any other info written in the "prisma/prisma.yml" file. And now "npm run get-schema" command works without any problem.

##-------

The line below added at the beginning of "schema.graphql" file:
#import UserOrderByInput from "./generated/prisma.graphql"
(With the number sign # at the beginning. This line imports UserOrderByInput enum types from GraphQL Server (not actually, from the schema get from there), so we can use these enum types in the code & querying from localhost:4000)

##-------

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
