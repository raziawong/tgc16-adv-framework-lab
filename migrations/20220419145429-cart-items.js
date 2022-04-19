"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("cart_items", {
    id: {
      type: "int",
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: "int",
      unsigned: true
    },
    user_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "cart_items_user_fk",
        table: "users",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      }
    },
    poster_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "cart_items_poster_fk",
        table: "posters",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT"
        },
        mapping: "id"
      }
    }
  });
};

exports.down = function (db) {
  db.removeForeignKey("cart_items", "cart_items_user_fk");
  db.removeForeignKey("cart_items", "cart_items_poster_fk");
  return db.dropTable("cart_items");
};

exports._meta = {
  "version": 1
};