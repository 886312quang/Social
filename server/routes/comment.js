const router = require('express').Router()
const comment = require('../controllers/comment')
const AuthMiddleware = require("../middleware/auth");


router.post('/', AuthMiddleware.isAuth, comment.createComment)

router.patch('/:id', AuthMiddleware.isAuth, comment.updateComment)

router.patch('/:id/like', AuthMiddleware.isAuth, comment.likeComment)

router.patch('/:id/unlike', AuthMiddleware.isAuth, comment.unLikeComment)

router.delete('/:id', AuthMiddleware.isAuth, comment.deleteComment)



module.exports = router