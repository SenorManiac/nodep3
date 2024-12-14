const { name } = require('ejs');
const pool = require('./pool');

async function getCategories() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM categories');
        return result.rows;
    } finally {
        client.release();
    }
}

async function getCategoryByName(name) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM categories WHERE name = $1', [name]);
        return result.rows[0];
    } finally {
        client.release();
    }
}

async function addCategory(categories) {
    const { name } = categories;
    const client = await pool.connect();
    try {
        const checkResult = await client.query('SELECT * FROM categories WHERE name = $1', [name]);
        if (checkResult.rows.length > 0) {
            const error = new Error('Category already exists');
            error.code = 'CATEGORY_EXISTS';
            error.message = name + ' already exists';
            throw error;
        }
        await client.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    } finally {
        client.release();
    }
}
async function deleteCategory(name) {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM categories WHERE name = $1', [name]);
    } finally {
        client.release();
    }
}

async function updateCategory(categories) {
    const {id, name} = categories;
    const client = await pool.connect();
    try {
        await client.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
    } finally {
        client.release();
    }
}

module.exports = {
    getCategories,
    addCategory,
    deleteCategory,
    updateCategory,
    getCategoryByName
};