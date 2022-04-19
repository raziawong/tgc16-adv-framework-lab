// import in caolan forms
const forms = require("forms");
const {
  fields,
  validators,
  widgets
} = forms;

var bootstrapField = function (name, object) {
  if (!Array.isArray(object.widget.classes)) {
    object.widget.classes = [];
  }

  if (object.widget.classes.indexOf("form-control") === -1) {
    object.widget.classes.push("form-control");
  }

  var validationclass = object.value && !object.error ? "is-valid" : "";
  validationclass = object.error ? "is-invalid" : validationclass;
  if (validationclass) {
    object.widget.classes.push(validationclass);
  }

  var label = object.labelHTML(name);
  var error = object.error ?
    '<div class="invalid-feedback">' + object.error + "</div>" :
    "";

  var widget = object.widget.toHTML(name, object);
  return '<div class="col-12 mb-3">' + label + widget + error + "</div>";
};

const createPosterForm = (mediaProperties, tags) => {
  return forms.create({
    title: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.minlength(5), validators.maxlength(100)],
    }),
    cost: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer(), validators.min(1)],
    }),
    date: fields.date({
      required: true,
      widget: widgets.date(),
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.date()],
    }),
    description: fields.string({
      errorAfterField: true,
      widget: widgets.textarea(),
      cssClasses: {
        label: ["form-label"],
      },
    }),
    stock: fields.number({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer(), validators.min(1)],
    }),
    height: fields.number({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer(), validators.min(10)],
    }),
    width: fields.number({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer(), validators.min(10)],
    }),
    media_property_id: fields.string({
      label: "Media Property",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: mediaProperties,
    }),
    tags: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.multipleSelect(),
      choices: tags,
    }),
    image_url: fields.string({
      widget: widgets.hidden(),
    }),
  });
};

const createRegisterForm = () => {
  return forms.create({
    username: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    confirm_password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.matchField("password")],
    }),
  });
};

const createLoginForm = () => {
  return forms.create({
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
  });
};

const createSearchForm = (mediaProperties, tags) => {
  return forms.create({
    title: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    min_cost: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer()],
    }),
    max_cost: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer()],
    }),
    media_property_id: fields.string({
      label: "Media Property",
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      widget: widgets.select(),
      choices: mediaProperties,
    }),
    tags: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      widget: widgets.multipleSelect(),
      choices: tags,
    }),
  });
};

module.exports = {
  bootstrapField,
  createPosterForm,
  createRegisterForm,
  createLoginForm,
  createSearchForm
};