const express = require('express');
const router = express.Router();
const { executeDCA } = require('../dca-engine');

router.post('/execute', auth, async (req, res) => {
  try {
    console.log("📥 Manual DCA trigger requested...");
    await executeDCA();
    res.status(200).json({ message: 'DCA executed successfully' });
  } catch (error) {
    console.error("❌ DCA execution failed:", error.message);
    res.status(500).json({ message: 'Failed to execute DCA', error: error.message });
  }
});

module.exports = router;