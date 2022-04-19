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
  return db.createTable("posters", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    title: { type: "string", length: 150, notNull: false },
    cost: { type: "int", unsigned: true },
    description: "text",
    date: { type: "date", notNull: false },
    stock: { type: "int", notNull: false, unsigned: true },
    height: { type: "int", notNull: false, unsigned: true },
    width: { type: "int", notNull: false, unsigned: true },
  });
};

exports.down = function (db) {
  return db.dropTable("posters");
};

exports._meta = {
  version: 1,
};