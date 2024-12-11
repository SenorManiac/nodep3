const db = require("../db/getCategories");
const db2 = require("../db/getProducts");
const fetchImage = require("../controllers/imageController");
const { get } = require("../routes");

getCategories = async (req, res) => {
    try {
        const categories = await db.getCategories();
        res.render("categories", { categories });
    } catch (error) {
        res.status(500).send("Error fetching categories");
    }
};

const addProductPage = async (req, res) => {
    try {
        const categories = await db.getCategories();
        res.render("addProduct", { categories });
    } catch (error) {
        res.status(500).send("Error fetching categories");
    }
};

const addCategory = async (req, res) => {
    const { name } = req.body;
    try {
        await db.addCategory({ name });
        res.redirect("../categories");
    } catch (error) {
        if (error.code === 'CATEGORY_EXISTS') {
            res.render("addCategory", { errorMessage: error.message });
        } else {
            res.status(500).send("Error adding category");
        }
    }
};

const getProductsByCategory = async (req, res) => {
    const { name } = req.params;
    try {
        const products = await db2.getProductsByCategory(name);
        res.render("products", { products });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
};

deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await db.deleteCategory(id);
        res.redirect("../../categories");
    } catch (error) {
        res.status(500).send("Error deleting category");
    }
};

updateCategory = async (req, res) => {
    const { id, name } = req.body;
    await db.updateCategory({ id, name });
    res.redirect("../../categories");
}

getProductsIndex = async (req, res) => {
    try {
        const products = await db2.getProducts();
        res.render("index", { products });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
};

getProducts = async (req, res) => {
    try {
        const products = await db2.getProducts();
        res.render("products", { products });
    } catch (error) {
     res.status(500).send("Error fetching products");
}
};


const getProductsById = async (req, res) => {
    try {
        const product = await db2.getProductById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        const imageUrl = await fetchImage(product.description);
        res.render("product", { product, imageUrl });
    } catch (error) {
        res.status(500).send("Error fetching product");
    }
};


addProduct = async (req, res) => {
    try {
        const { name, sku, description, category, quantity, price } = req.body;
        await db2.addProduct({ name, sku, description, category, quantity, price });
        res.redirect("../products");
    }catch (error) {
        if (error.code === '23505') {
            res.status(400).send("Product already exists");
        } else {
            res.status(500).send("Error adding product");
        }
    }
}

deleteProduct = async (req, res) => {
    const { id } = req.params;
    await db2.deleteProduct(id);
    res.redirect("../../products");
}

const updateProduct = async (req, res) => {
    const { id, name, sku, description, category, quantity, price } = req.body;
    await db2.updateProduct({ id, name, sku, description, category, quantity, price });
    res.redirect("../products/" + id);
};

module.exports = {
    getCategories,
    addCategory,
    deleteCategory,
    updateCategory,
    getProductsIndex,
    getProducts,
    getProductsById,
    getProductsByCategory,
    addProductPage,
    addProduct,
    deleteProduct,
    updateProduct
};