const cloudinary = require("../config/photo");
const {
    getAllRecipes,
    postRecipe,
    getRecipeById,
    putRecipe,
    deleteRecipeById,
    getCategory,
    getRecipes,
    getRecipesCount,
    getAllRecipesByUserId,
} = require("../model/recipes");

const RecipesController = {
    categoryAll: async (req, res, next) => {
        let category = await getCategory();
        res.status(200).json({
            messsage: "success get category",
            data: category.rows,
        });
    },
    getRecipesDetail: async (req, res, next) => {
        let { search, searchBy, limit, sortBy } = req.query;

        searchBy = searchBy || "title";
        let limiter = limit || 5;
        let page = req.query.page || 1;
        let asc = sortBy || "ASC";

        console.log(req.query);

        let data = {
            searchBy,
            search: search || "",
            offset: (page - 1) * limiter,
            limit: limit || 3,
            asc,
        };

        let recipes = await getRecipes(data);
        let result = recipes.rows;
        let { rows } = await getRecipesCount(data);
        let count = parseInt(rows[0].count);
        console.log("count");
        console.log(count);

        let pagination = {
            totalPage: Math.ceil(count / limiter),
            totalData: count,
            pageNow: parseInt(page),
        };

        if (!result) {
            return res.status(404).json({ messsage: "failed get result" });
        }

        result.forEach((item, index) => {
            let ingredients = item.ingredients.split(",");
            result[index].ingredients = ingredients;
        });

        res.status(200).json({
            messsage: "success get data",
            data: result,
            dataLength: result.length,
            pagination,
        });
    },
    getRecipesUser: async (req, res, next) => {
        let { uuid } = req.payload;
        let recipes = await getAllRecipesByUserId(uuid);
        let data = recipes.rows;

        if (!data) {
            return res.status(404).json({ messsage: "failed get data" });
        }

        data.forEach((item, index) => {
            let ingredients = item.ingredients.split(",");
            data[index].ingredients = ingredients;
            console.log(item.ingredients);
        });

        res.status(200).json({
            messsage: `success get recipe user : ${req.payload.username}`,
            data,
        });
    },
    getRecipesUserByIdUser: async (req, res, next) => {
        let { id } = req.params;
        let recipes = await getAllRecipesByUserId(id);
        let data = recipes.rows;

        if (!data) {
            return res.status(404).json({ messsage: "failed get data" });
        }

        data.forEach((item, index) => {
            let ingredients = item.ingredients.split(",");
            data[index].ingredients = ingredients;
            console.log(item.ingredients);
        });

        res.status(200).json({
            messsage: `success get recipe user : ${req.payload.username}`,
            data,
        });
    },
    getRecipes: async (req, res, next) => {
        let recipes = await getAllRecipes();
        let data = recipes.rows;

        if (!data) {
            return res.status(404).json({ messsage: "failed get data" });
        }

        data.forEach((item, index) => {
            let ingredients = item.ingredients.split(",");
            data[index].ingredients = ingredients;
            console.log(item.ingredients);
        });

        res.status(200).json({ messsage: "success get data", data });
    },
    getRecipeId: async (req, res, next) => {
        let id = req.params.id;
        console.log("param id = ", id);
        let recipes = await getRecipeById(id);
        let data = recipes.rows[0];
        data.ingredients = data.ingredients.split(",");
        if (!data) {
            return res.status(404).json({ messsage: "failed get data" });
        }
        res.status(200).json({ messsage: "success get data", data });
    },
    deleteRecipeId: async (req, res, next) => {
        let { uuid } = req.payload;
        let id = req.params.id;
        console.log("param id = ", id);
        let recipe_data = await getRecipeById(id);
        console.log("recipe_data");
        console.log(uuid);
        console.log(recipe_data);
        if (recipe_data.rows[0].users_id !== uuid) {
            return res
                .status(404)
                .json({ messsage: "failed, data cannot update by this user" });
        }

        let recipes = await deleteRecipeById(id);
        console.log("recipes ", recipes);
        if (recipes.rowCount == 0) {
            return res.status(404).json({ messsage: "failed delete data" });
        }
        res.status(200).json({ messsage: "success delete data" });
    },
    inputRecipe: async (req, res, next) => {
        let { title, ingredients, category_id } = req.body;
        let { uuid } = req.payload;
        console.log(title, ingredients, category_id);

        if (!req.file) {
            return res.status(400).json({ messsage: "photo is required" });
        }
        if (!req.isFileValid) {
            return res.status(400).json({ messsage: isFileValidMessage });
        }

        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
            folder: "recipes",
        });
        console.log("imageUpload");
        console.log(imageUpload);

        if (!imageUpload) {
            return res.status(400).json({ messsage: "upload photo failed" });
        }

        if (!title || !ingredients || !category_id) {
            return res.status(404).json({
                messsage:
                    "failed input data, title, ingredients, photo, category_id is required",
            });
        }

        let category = await getCategory();
        let is_category = false;
        category.rows.forEach((item) => {
            if (item.id == category_id) {
                is_category = true;
            }
        });

        if (!is_category) {
            return res.status(404).json({ messsage: "category invalid" });
        }

        let data = {
            title,
            ingredients,
            photo: imageUpload.secure_url,
            category_id: parseInt(category_id),
            uuid,
        };
        let result = await postRecipe(data);

        if (!result) {
            return res.status(404).json({ messsage: "failed input data" });
        }
        res.status(200).json({ messsage: "success input data", data });
    },
    updateRecipe: async (req, res, next) => {
        let id = req.params.id;
        let { uuid } = req.payload;
        let { title, ingredients, category_id } = req.body;
        console.log(title, ingredients, category_id);

        let recipe_data = await getRecipeById(id);

        console.log("recipe_data");
        console.log(recipe_data);

        if (recipe_data.rows[0].users_id !== uuid) {
            return res
                .status(404)
                .json({ messsage: "failed, data cannot update by this user" });
        }

        if (recipe_data.rowCount == 0) {
            return res.status(404).json({ messsage: "failed, data not found" });
        }

        let data = recipe_data.rows[0];

        if (!category_id) {
            category_id = data.category_id;
        } else if (isNaN(parseInt(category_id))) {
            return res.status(404).json({ messsage: "category invalid" });
        } else {
			let category = await getCategory();
            let is_category = false;
            category.rows.forEach((item) => {
                if (item.id == category_id) {
                    is_category = true;
                }
            });
			if(!is_category){
            return res.status(404).json({ messsage: "category not found" });
			}
        }

        console.log("category_id");
        console.log(category_id);

        let newData = {
            id: data.id,
            title: title || data.title,
            ingredients: ingredients || data.ingredients,
            category_id,
        };
        // check photo

        if (!req.file) {
            newData.photo = data.photo;
            console.log(data);
            console.log(newData);

            let result = await putRecipe(newData);
            console.log(result);

            if (!result) {
                return res.status(404).json({ messsage: "failed update data" });
            }
            return res
                .status(200)
                .json({ messsage: "success update data without photo" });
        }

        if (req.file) {
            if (!req.isFileValid) {
                return res
                    .status(404)
                    .json({
                        messsage:
                            "failed update data, photo must be image file",
                    });
            }
            const imageUpload = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "recipes",
                }
            );
            console.log("imageUpload");
            console.log(imageUpload);

            if (!imageUpload) {
                return res
                    .status(400)
                    .json({ messsage: "upload photo failed" });
            }
            newData.photo = imageUpload.secure_url;
            console.log(data);
            console.log(newData);

            let result = await putRecipe(newData);
            console.log(result);

            if (!result) {
                return res.status(404).json({ messsage: "failed update data" });
            }
            res.status(200).json({
                messsage: "success update data with photo",
            });
        }
    },
};

module.exports = RecipesController;
