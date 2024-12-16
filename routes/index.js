const express = require("express");
const inventoryController = require("../controllers/inventoryController");

const router = express.Router();


router.get("/", inventoryController.getProductsAndCategories);


router.post("/addcategory", async (req, res) => {
    try {
        await inventoryController.addCategory(req, res);
    } catch (error) {
        res.render("addCategory", { errorMessage: error.message });
    }
});
router.post("/addproduct", inventoryController.addProduct);
router.post("/deletecategory/:id", inventoryController.deleteCategory);
router.get("/deleteproduct/:id", inventoryController.deleteProduct);
router.post("/updatecategory", inventoryController.updateCategory);
router.post("/updateproduct/:id", inventoryController.updateProduct);


router.get("/categories/:name/delete", inventoryController.deleteCategory);

router.get("/addcategory", (req, res) => {
    res.render("addcategory"); 
});
router.get("/addproduct", inventoryController.addProductPage);


router.get("/updatecategory/:id", (req, res) => {
    res.render("updatecategory", { id: req.params.id }); 
});

router.get("/updateproduct/:id", (req, res) => {
    res.render("updateproduct", { id: req.params.id }); 
});

router.get("/categories", inventoryController.getCategories);

router.get("/products", inventoryController.getProducts);
router.get("/products/:id", inventoryController.getProductsById);
router.get("/categories/:name/products", inventoryController.getProductsByCategory);






module.exports = router;
