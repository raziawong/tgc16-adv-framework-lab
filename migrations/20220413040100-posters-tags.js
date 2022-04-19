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
  return db.createTable("posters_tags", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    poster_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "posters_tags_poster_fk",
        table: "posters",
        mapping: "id",
        rules: {
          onDelete: "restrict",
          onUpdate: "restrict",
        },
      },
    },
    tag_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "posters_tags_tag_fk",
        table: "tags",
        mapping: "id",
        rules: {
          onDelete: "restrict",
          onUpdate: "restrict",
        },
      },
    },
  });
};

exports.down = function (db) {
  db.removeForeignKey("posters_tags", "posters_tags_poster_fk");
  db.removeForeignKey("posters_tags", "posters_tags_tag_fk");
  return db.dropTable("posters_tags");
};

exports._meta = {
  version: 1,
};
