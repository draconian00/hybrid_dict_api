const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(
    {
      "type" : "buttons",
      "buttons" : ["혼종 한영/영한 사전"]
    }
  )
});

module.exports = router;