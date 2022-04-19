const express = require("express");
const { Poster, MediaProperty, Tag } = require("../models");
const { bootstrapField, createPosterForm } = require("../forms");
const { checkIfAuthenticated } = require("../middlewares");

// create the new router
const router = express.Router();

async function getPosterById(id) {
  return await Poster.where({
    id,
  }).fetch({
    require: true,
    withRelated: ["mediaProperty", "tags"],
  });
}

async function getAllMediaProperties() {
  const allMediaProperties = await MediaProperty.fetchAll().map((p) => [
    p.get("id"),
    p.get("name"),
  ]);
  return allMediaProperties;
}

async function getAllTags() {
  const allTags = await Tag.fetchAll().map((t) => [t.get("id"), t.get("name")]);
  return allTags;
}

router.get("/", async (req, res) => {
  const posters = await Poster.collection().fetch({
    withRelated: ["mediaProperty", "tags"],
  });
  res.render("posters/index", {
    posters: posters.toJSON(),
  });
});

router.get("/create", checkIfAuthenticated, async (req, res) => {
  const posterForm = createPosterForm(
    await getAllMediaProperties(),
    await getAllTags()
  );

  res.render("posters/create", {
    form: posterForm.toHTML(bootstrapField),
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

router.post("/create", checkIfAuthenticated, async (req, res) => {
  const posterForm = createPosterForm(
    await getAllMediaProperties(),
    await getAllTags()
  );
  posterForm.handle(req, {
    success: async (form) => {
      let { tags, ...inputs } = form.data;
      const poster = new Poster();
      poster.set(inputs);
      await poster.save();

      if (tags) {
        await poster.tags().attach(tags.split(","));
      }
      req.flash(
        "success_messages",
        `New Product ${poster.get("title")} has been created`
      );
      res.redirect("/posters");
    },
    error: async (form) => {
      res.render("posters/create", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/:id/update", checkIfAuthenticated, async (req, res) => {
  const poster = await getPosterById(req.params.id);
  let posterForm = createPosterForm(
    await getAllMediaProperties(),
    await getAllTags()
  );
  let { tags, ...dbData } = poster.attributes;
  let selTags = await poster.related("tags").pluck("id");
  posterForm = posterForm.bind({ ...dbData, tags: selTags });

  res.render("posters/update", {
    form: posterForm.toHTML(bootstrapField),
    poster: poster.toJSON(),
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

router.post("/:id/update", checkIfAuthenticated, async (req, res) => {
  const poster = await getPosterById(req.params.id);
  const posterForm = createPosterForm(
    await getAllMediaProperties(),
    await getAllTags()
  );
  posterForm.handle(req, {
    success: async (form) => {
      let { tags, ...inputs } = form.data;
      poster.set(inputs);
      poster.save();

      let selTags = tags.split(",");
      let existTags = await poster.related("tags").pluck("id");
      let toRemove = existTags.filter((id) => selTags.includes(id) === false);
      await poster.tags().detach(toRemove);
      await poster.tags().attach(selTags);
      res.redirect("/posters");
    },
    error: async (form) => {
      res.render("posters/update", {
        form: form.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });
    },
  });
});

router.get("/:id/delete", checkIfAuthenticated, async (req, res) => {
  const poster = await getPosterById(req.params.id);
  res.render("posters/delete", {
    poster: poster.toJSON(),
  });
});

router.post("/:id/delete", checkIfAuthenticated, async (req, res) => {
  const poster = await getPosterById(req.params.id);
  await poster.destroy();
  res.redirect("/posters");
});

module.exports = router;
