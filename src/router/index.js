const express = require("express")
const recipes = require("./recipes")
const auth = require("./auth")
const { categoryAll } = require("../controller/recipes")
const router = express.Router()

router.use('/auth',auth)
router.use('/recipe',recipes)
router.get('/category',categoryAll)


module.exports = router;