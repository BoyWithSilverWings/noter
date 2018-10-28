const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const HTTP_CODE = require("../config/httpStatus");

const Note = require("../models").Note;

/**
 * Create a New Note
 */
exports.create = [
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must have at least 3 characters.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),
  sanitizeBody("title")
    .trim()
    .escape(),
  sanitizeBody("text")
    .trim()
    .escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response = {
        status: HTTP_CODE.HTTP_FAILURE,
        errors: errors.array()
      };
      res.json(response);
      return;
    }

    // Create a Note
    Note.create({
      title: req.body.title || "Untitled Note",
      text: req.body.text
    }).then(
      success => {
        const response = {
          status: HTTP_CODE.HTTP_SUCCESS,
          result: "Note added successfully"
        };
        res.status(201).json(response);
      },
      failure => {
        const response = {
          status: HTTP_CODE.HTTP_FAILURE,
          result: "Note creation failed",
          description: JSON.stringify(failure)
        };
        res.status(400).json(response);
      }
    );
  }
];

exports.findAll = (req, res) => {
  Note.findAll().then(result => {
    const response = {
      status: HTTP_CODE.HTTP_SUCCESS,
      result: result
    };
    res.status(200).json(response);
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Note.findOne({ where: { id: id } }).then(
    result => {
      if (result) {
        const response = {
          status: HTTP_CODE.HTTP_SUCCESS,
          result
        };
        res.json(response);
      } else {
        const response = {
          status: HTTP_CODE.HTTP_FAILURE,
          result: "No Result Found"
        };
        res.status(404).json(response);
      }
    },
    failure => {
      const response = {
        status: HTTP_CODE.HTTP_FAILURE,
        result: failure
      };
      res.json(response);
    }
  );
};
