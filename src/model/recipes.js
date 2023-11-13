const Pool = require("../config/db");

const getAllRecipes = async () => {
    console.log("model getAllRecipes");
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT recipes.id, recipes.title, recipes.ingredients, recipes.photo, category.name AS category FROM recipes JOIN category ON recipes.category_id=category.id`, (err, result) => {
            if (!err) {
                return resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const getAllRecipesByUserId = async (user_id) => {
    console.log("model getAllRecipes");
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT recipes.id, recipes.title, recipes.ingredients, recipes.photo, category.name AS category FROM recipes JOIN category ON recipes.category_id=category.id WHERE users_id='${user_id}'`, (err, result) => {
            if (!err) {
                return resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const getRecipes = async (data) => {
    console.log("model getAllRecipes");
    let {search, searchBy, offset,limit,asc} = data
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT recipes.id, recipes.title, recipes.ingredients, recipes.photo, category.name AS category FROM recipes JOIN category ON recipes.category_id=category.id WHERE recipes.${searchBy} ILIKE '%${search}%' ORDER BY ID ${asc} offset ${offset} LIMIT ${limit}`, (err, result) => {
            if (!err) {
                return resolve(result);
            } else {
                reject(err);
            }
        })
    );
};
const getRecipesCount = async (data) => {
    console.log("model getRecipesCount");
    let {search, searchBy} = data
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT COUNT(*) FROM recipes JOIN category ON recipes.category_id=category.id WHERE recipes.${searchBy} ILIKE '%${search}%'`, (err, result) => {
            if (!err) {
                return resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const getRecipeById = async (id) => {
    console.log("model getRecipeById");
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT recipes.id, recipes.title, recipes.ingredients, recipes.photo, recipes.users_id, category.name AS category, category.id AS category_id FROM recipes JOIN category ON recipes.category_id=category.id WHERE recipes.id=${id}`, (err, result) => {
            if (!err) {
                return resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const deleteRecipeById = async (id) => {
    console.log("model deleteRecipeById");
    return new Promise((resolve, reject) =>
        Pool.query(`DELETE FROM recipes WHERE id=${id}`, (err, result) => {
            if (!err) {
                return resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const postRecipe = async (data) => {
    console.log("model postRecipe");
    let { title, ingredients, photo, category_id,uuid } = data;
    return new Promise((resolve, reject) =>
        Pool.query(
            `INSERT INTO recipes (title, ingredients,photo,category_id,users_id) VALUES('${title}','${ingredients}','${photo}',${category_id},'${uuid}')`,
            (err, result) => {
                if (!err) {
                    return resolve(result);
                } else {
                    reject(err);
                }
            }
        )
    );
};

const putRecipe = async (data) => {
    console.log("model putRecipe");
    let { id, title, ingredients, photo, category_id } = data;
    return new Promise((resolve, reject) =>
        Pool.query(
            `UPDATE recipes SET title='${title}', ingredients='${ingredients}',photo='${photo}',category_id=${category_id} WHERE id=${id}`,
            (err, result) => {
                if (!err) {
                    return resolve(result);
                } else {
                    reject(err);
                }
            }
        )
    );
};


const getCategory = async () => {
    console.log("model getCategory");
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT * FROM category`, (err, result) => {
            if (!err) {
                return resolve(result);
            } else {
                reject(err);
            }
        })
    );
};
module.exports = {
    getAllRecipes,
    postRecipe,
    putRecipe,
    getRecipeById,
    deleteRecipeById,
    getCategory,
    getRecipes,
    getRecipesCount,
    getAllRecipesByUserId
};
