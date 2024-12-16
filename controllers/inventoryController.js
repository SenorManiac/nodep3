const db = require("../db/getCategories");
const db2 = require("../db/getProducts");
const fetchImage = require("../controllers/imageController");
const { get } = require("../routes");

const getCategories = async (req, res) => {
    try {
        const categories = await db.getCategories();
        const updatedCategories = await Promise.all(categories.map(async category => {
            if (!category.imageurl) {
                const imageurl = await fetchImage(category.name);
                if (imageurl) {
                    await db.updateCategoryImage({ id: category.id, imageurl });
                    return { ...category, imageurl };
                }
            }
            return category;
        }));

        res.render("categories", { categories: updatedCategories });
    } catch (error) {
        console.error('Error in getCategories:', error);
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
        const imageUrls = await Promise.all(products.map(async product => {
            const imageUrl = await fetchImage(product.name);
            return { id: product.id, imageUrl };
        }));
        const category = await db.getCategoryByName(name);
        res.render("products", { products, imageUrls, category });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
};


const deleteCategory = async (req, res) => {
    const { name } = req.params;
    try {        
        const products = await db2.getProductsByCategory(name);
        if (products.length > 0) {
            const categories = await db.getCategories();
            const imageUrls = await Promise.all(categories.map(async category => {
                const imageUrl = await fetchImage(category.name);
                return { id: category.id, imageUrl };
            }));
            return res.render("categories", { categories, imageUrls, errorMessage: "Cannot delete category with products" });
        }
        await db.deleteCategory(name);
        res.redirect("/categories");
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


const getProducts = async (req, res) => {
    try {
        const products = await db2.getProducts();
        const updatedProducts = await Promise.all(products.map(async product => {
            if (!product.imageurl) {
                const imageurl = await fetchImage(product.name);
                if (imageurl) {
                    // Ensure id is passed as a number
                    await db2.updateProductImage({ 
                        id: parseInt(product.id), 
                        imageurl 
                    });
                    return { ...product, imageurl };
                }
            }
            return product;
        }));

        res.render("products", { products: updatedProducts });
    } catch (error) {
        console.error('Error in getProducts:', error);
        res.status(500).send("Error fetching Products");
    }
};

const getProductsById = async (req, res) => {
    try {
        const product = await db2.getProductById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        const imageUrl = await fetchImage(product.description);
        const categories = await db.getCategories();
        res.render("product", { product, imageUrl, categories });
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

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    await db2.deleteProduct(id);
    res.redirect("../../products");
}

const updateProduct = async (req, res) => {
    const { id, name, sku, description, category, quantity, price } = req.body;
    await db2.updateProduct({ id, name, sku, description, category, quantity, price });
    res.redirect("../products/" + id);
};

const getProductsAndCategories = async (req, res) => {
    try {
        const products = await db2.getProducts();
        const categories = await db.getCategories();
        const imageUrls = await Promise.all(categories.map(async category => {
            const imageUrl = await fetchImage(category.name);
            return { id: category.id, imageUrl };
        }));
        res.render("index", { products, categories, imageUrls });
    } catch (error) {
        res.status(500).send("Error fetching products and categories");
    }
};

const getProductsAndCategories2 = async (req, res) => {
    try {
        const products = await db2.getProducts();
        const categories = await db.getCategories();
        const imageUrls = await Promise.all(categories.map(async category => {
            const imageUrl = await fetchImage(category.name);
            return { id: category.id, imageUrl };
        }));
        res.render("products", { products, categories, imageUrls });
    } catch (error) {
        res.status(500).send("Error fetching products and categories");
    }
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
    updateProduct,
    getProductsAndCategories,
};