const express = require("express");
const {
    getStaticValues,
} = require("../controllers/static");
const router = express.Router();

router.route("/data").post(getStaticValues);


module.exports = router;
