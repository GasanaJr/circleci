const router = require('express').Router();
const verify = require('./verifyRoute');

router.get('/',verify, (req,res) => {
    res.json({
        posts: {
            title: 'My first POst',
            description: 'RAndom data'
        }
    });
});

module.exports = router;