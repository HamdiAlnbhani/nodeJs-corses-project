const { body } = require("express-validator");
const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 2 })
      .withMessage("title must be at least 2 characters long"),
    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isLength({ min: 2 })
      .withMessage("price must be at least 2 numbers long"),
  ];
};

module.exports = { validationSchema };
