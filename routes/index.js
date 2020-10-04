const { Router } = require('express')
const router = new Router();

router.get('/', (req, res) => { res.json({}) });

module.exports = router;