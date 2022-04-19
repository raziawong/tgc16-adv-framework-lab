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
  return db.addForeignKey(
    "posters",
    "media_properties",
    "poster_media_property_fk",
    {
      media_property_id: "id",
    },
    {
      onDelete: "restrict",
      onUpdate: "restrict",
    }
  );
};

exports.down = function (db) {
  db.removeForeignKey("posters", "poster_media_property_fk");
};

exports._meta = {
  version: 1,
};
