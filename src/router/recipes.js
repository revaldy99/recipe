const express = require("express")
const {getRecipes, inputRecipe, getRecipeId, updateRecipe, deleteRecipeId,getRecipesDetail,getRecipesUser,getRecipesUserByIdUser, categoryAll} = require("../controller/recipes")
const {Protect} = require("../middlewares/private")
const upload = require("../middlewares/upload")
const router = express.Router()

router.get('/',Protect,getRecipes)
router.get('/recipeuser',Protect,getRecipesUser)
router.get('/user/:id',Protect,getRecipesUserByIdUser)
router.get('/detail',getRecipesDetail)
router.get('/:id',getRecipeId)
router.post('/',Protect,upload.single('photo'),inputRecipe)
router.put('/:id',Protect,upload.single('photo'),updateRecipe)
router.delete('/:id',Protect,deleteRecipeId)

router.get('/kategori',Protect,categoryAll)

module.exports = router;