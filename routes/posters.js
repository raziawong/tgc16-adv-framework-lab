const express = require("express");
const {
  getPosters,
  getPosterById,
  getAllMediaProperties,
  getAllTags,
  addPoster,
  updatePoster
} = require("../dal/posters");
const {
  bootstrapField,
  createPosterForm,
  createSearchForm
} = require("../forms");
const {
  checkIfAuthenticated
} = require("../middlewares");
const {
  Poster
} = require("../models");

// create the new router
const router = express.Router();


// router.get("/", async (req, res) => {
//   const posters = await Poster.collection().fetch({
//     withRelated: ["mediaProperty", "tags"],
//   });
//   res.render("posters/index", {
//     posters: posters.toJSON(),
//   });
// });

router.get('/', async (req, res) => {
  // 1. get all the media properties
  const allMediaProperties = await getAllMediaProperties();
  allMediaProperties.unshift(["", "Please select"]);

  // 2. get all the tags
  const allTags = await getAllTags();

  // 3. create search form 
  const searchForm = createSearchForm(allMediaProperties, allTags);

  searchForm.handle(req, {
    empty: async (form) => {
      res.render("posters/index", {
        posters: (await getPosters()).toJSON(),
        form: form.toHTML(bootstrapField)
      });
    },
    error: async (form) => {
      res.render('products/index', {
        posters: (await getPosters()).toJSON(),
        form: form.toHTML(bootstrapField)
      });
    },
    success: async (form) => {
      let query = await Poster.collection();
      if (form.data.title) {
        query = query.where('title', 'like', '%' + req.query.title + '%')
      }

      if (form.data.media_property_id) {
        query = query.query('join', 'media_properties', 'media_property_id', 'media_properties.id')
          .where('media_properties.id', '=', req.query.media_property_id)
      }

      if (form.data.min_cost) {
        query = query.where('cost', '>=', req.query.min_cost)
      }

      if (form.data.max_cost) {
        query = query.where('cost', '<=', req.query.max_cost);
      }

      if (form.data.tags) {
        query.query('join', 'posters_tags', 'posters.id', 'poster_id')
          .where('tag_id', 'in', form.data.tags.split(','))
      }

      res.render("posters/index", {
        posters: (await getPosters(query)).toJSON(),
        form: form.toHTML(bootstrapField)
      });
    }
  })
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
      const poster = await addPoster(form.data);
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
  let {
    tags,
    ...dbData
  } = poster.attributes;
  let selTags = await poster.related("tags").pluck("id");
  posterForm = posterForm.bind({
    ...dbData,
    tags: selTags
  });

  res.render("posters/update", {
    form: posterForm.toHTML(bootstrapField),
    poster: poster.toJSON(),
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

router.post("/:id/update", checkIfAuthenticated, async (req, res) => {
  const posterForm = createPosterForm(
    await getAllMediaProperties(),
    await getAllTags()
  );
  posterForm.handle(req, {
    success: async (form) => {
      await updatePoster(req.params.id, form.data);
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