const pool = require('./pool');

async function getProducts() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM products');
        return result.rows;
    } finally {
        client.release();
    }
}

async function getProductById(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    } finally {
        client.release();
    }
}

async function addProduct(products) {
    const {name, sku, description, category, quantity, price} = products;
    const client = await pool.connect();
    try {
        const checkResult = await client.query('SELECT * FROM products WHERE name = $1', [name]);
        if (checkResult.rows.length > 0) {
            throw new Error('Product already exists');
        }await client.query('INSERT INTO products (name, sku, description, category, quantity, price) VALUES ($1, $2, $3, $4, $5, $6)', [name, sku, description, category, quantity, price]);
    } finally {
        client.release();
    }
}

async function deleteProduct(id) {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM products WHERE id = $1', [id]);
    } finally {
        client.release();
    }
}

async function updateProduct(products) {
    const {id, name, sku, description, category, quantity, price} = products;
    const client = await pool.connect();
    try {
        await client.query('UPDATE products SET name = $1, sku = $2, description = $3, category = $4, quantity = $5, price = $6 WHERE id = $7', [name, sku, description, category, quantity, price, id]);
    } finally {
        client.release();
    }
}

async function getProductsByCategory(category) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM products WHERE category = $1', [category]);
        return result.rows;
    } finally {
        client.release();
    }
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct,
    getProductsByCategory
};