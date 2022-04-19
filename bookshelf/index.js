// require('knex') returns a config function which
// we call immediately with an object as the first argument

const knex = require("knex")({
  client: "mysql",
  connection: {
    user: "foo",
    password: "foobarPW@",
    database: "tgc16_poster_shop",
  },
});

const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;
