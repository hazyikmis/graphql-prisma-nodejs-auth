const users = [
  {
    id: "1",
    name: "Halil",
    email: "halo@yaho.com",
    age: 44,
  },
  {
    id: "2",
    name: "Emel",
    email: "emo@yaho.com",
  },
  {
    id: "3",
    name: "Yagmur",
    email: "yamo@yaho.com",
    age: 15,
  },
  {
    id: "4",
    name: "Bella the cat",
    email: "bella@yaho.com",
    age: 1,
  },
];

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: ".....sdf.f.s.df.s.d.fs",
    published: true,
    author: "1",
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: ".....sdf.f.s.df.s.d.fs",
    published: true,
    author: "1",
  },
  {
    id: "12",
    title: "JavaScript",
    body: ".....javajabajavajava",
    published: true,
    author: "1",
  },
  {
    id: "13",
    title: "NodeJS",
    body: ".....nodenodenode js jsj js",
    published: false,
    author: "2",
  },
  {
    id: "14",
    title: "React",
    body: "react react react",
    published: true,
    author: "2",
  },
  {
    id: "15",
    title: "Redux",
    body: "redddux react",
    published: false,
    author: "3",
  },
];

const comments = [
  {
    id: "101",
    text: "Nice to meet you darling...",
    post: "10",
    author: "4",
  },
  {
    id: "102",
    text: "COVID-19 is a real disaster all around the world",
    post: "10",
    author: "1",
  },
  {
    id: "103",
    text: "Do you want to eat more?",
    post: "11",
    author: "1",
  },
  {
    id: "104",
    text: "Goddamn!!!, shame on you!",
    post: "11",
    author: "2",
  },
  {
    id: "105",
    text: "Feeling sleepy...zzz",
    post: "13",
    author: "4",
  },
  {
    id: "106",
    text: "Still to much things to do",
    post: "13",
    author: "4",
  },
];

// export const db = {
//   users,
//   posts,
//   comments,
// };

//export { db as default };

//export { users, posts, comments };

//export default { users, posts, comments };

module.exports = { users, posts, comments };
//module.exports;
