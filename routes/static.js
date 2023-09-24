const express = require("express");
const {
    getStaticValues,
} = require("../controllers/static");
const router = express.Router();

router.route("/data").get(getStaticValues);


module.exports = router;
