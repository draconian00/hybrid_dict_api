const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(
    {
      "type" : "text"
    }
  )
});

module.exports = router;