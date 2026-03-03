import express from 'express';
import { query, getOne } from '../utils/db.js';

const router = express.Router();

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY id DESC';
    
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const products = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    
    if (category) {
      countSql += ' AND category = ?';
      countParams.push(category);
    }
    if (search) {
      countSql += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [totalResult] = await query(countSql, countParams);
    const total = totalResult.total;

    res.json({
      products,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await getOne('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await query(
      'SELECT * FROM products WHERE category = ? ORDER BY id DESC',
      [req.params.category]
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search products
router.get('/search/:term', async (req, res) => {
  try {
    const term = `%${req.params.term}%`;
    const products = await query(
      `SELECT * FROM products 
       WHERE name LIKE ? OR description LIKE ? OR brand LIKE ? 
       ORDER BY id DESC`,
      [term, term, term]
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;