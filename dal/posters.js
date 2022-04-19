const {
  Poster,
  MediaProperty,
  Tag
} = require("../models");


const getPosters = async (query = null) => {
  if (query) {
    return await query.fetch({
      withRelated: ["mediaProperty", "tags"]
    });
  }

  return await Poster.collection().fetch({
    withRelated: ["mediaProperty", "tags"]
  });
};

const getPosterById = async (id) => {
  return await Poster.where({
    id,
  }).fetch({
    require: true,
    withRelated: ["mediaProperty", "tags"],
  });
};

const addPoster = async (data) => {
  let {
    tags,
    ...inputs
  } = data;
  const poster = new Poster();
  poster.set(inputs);
  await poster.save();

  if (tags) {
    await poster.tags().attach(tags.split(","));
  }

  return poster;
};

const updatePoster = async (id, data) => {
  const poster = await getPosterById(id);
  let {
    tags,
    ...inputs
  } = data;
  poster.set(inputs);
  await poster.save();

  let selTags = tags.split(",");
  let existTags = await poster.related("tags").pluck("id");
  let toRemove = existTags.filter((id) => selTags.includes(id) === false);
  await poster.tags().detach(toRemove);
  await poster.tags().attach(selTags);

  return poster;
};

const getAllMediaProperties = async () => {
  const allMediaProperties = await MediaProperty.fetchAll().map((p) => [
    p.get("id"),
    p.get("name"),
  ]);
  return allMediaProperties;
};

const getAllTags = async () => {
  const allTags = await Tag.fetchAll().map((t) => [t.get("id"), t.get("name")]);
  return allTags;
};

module.exports = {
  getPosters,
  getPosterById,
  addPoster,
  updatePoster,
  getAllMediaProperties,
  getAllTags
};