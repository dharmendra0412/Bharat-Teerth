import express from 'express';
import { db } from '../db/index.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/circuits - List all circuits
router.get('/', async (req, res) => {
  try {
    const circuits = await db.getCircuits();
    res.json({
      success: true,
      count: circuits.length,
      data: circuits
    });
  } catch (err) {
    console.error('Error fetching circuits:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving circuits.' });
  }
});

// GET /api/circuits/:id - Get circuit details with associated temples
router.get('/:id', async (req, res) => {
  try {
    const circuit = await db.getCircuitById(req.params.id);
    if (!circuit) {
      return res.status(404).json({ success: false, message: 'Pilgrimage circuit not found.' });
    }

    // Match all temples in this circuit
    const allTemples = await db.getTemples();
    const templesInCircuit = allTemples.filter(t => t.circuits && t.circuits.includes(circuit.id));

    res.json({
      success: true,
      data: {
        ...circuit,
        temples: templesInCircuit
      }
    });
  } catch (err) {
    console.error('Error fetching circuit by id:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving circuit.' });
  }
});

// POST /api/circuits - Admin create circuit
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, overview, deity } = req.body;
    if (!name || !overview) {
      return res.status(400).json({ success: false, message: 'Name and Overview are required.' });
    }
    const created = await db.createCircuit(req.body);
    res.status(201).json({
      success: true,
      message: 'Pilgrimage circuit successfully mapped.',
      data: created
    });
  } catch (err) {
    console.error('Error creating circuit:', err);
    res.status(500).json({ success: false, message: 'Server error creating circuit.' });
  }
});

export default router;
