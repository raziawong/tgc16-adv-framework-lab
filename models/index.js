const bookshelf = require("../bookshelf");

const Poster = bookshelf.model("Poster", {
  tableName: "posters",
  mediaProperty: function () {
    return this.belongsTo("MediaProperty");
  },
  tags: function () {
    return this.belongsToMany("Tag");
  }
});

const MediaProperty = bookshelf.model("MediaProperty", {
  tableName: "media_properties",
  postersL: function () {
    return this.hasMany("Poster");
  }
});

const Tag = bookshelf.model("Tag", {
  tableName: "tags",
  posters: function () {
    return this.hasMany("Poster");
  }
});

const User = bookshelf.model("User", {
  tableName: "users"
});

const CartItem = bookshelf.model('CartItem', {
  tableName: "cart_items",
  poster: function () {
    return this.belongsTo("Poster");
  },
  user: function () {
    return this.belongsTo("User");
  }
});

module.exports = {
  Poster,
  MediaProperty,
  Tag,
  User,
  CartItem
};