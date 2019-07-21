const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')

router.post('', checkAuth,  (req, res, next) => {
  const posts = new Post({
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  })
  posts.save().then(createPost => {
    res.send({ message: "post saved successfully", postId: createPost._id });
  });

})

router.put('/:id', checkAuth, (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post).then(
    result => {
      console.log(result);
      res.send({message: "update successfully"})
    }
  )
})

router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.json({
        message: "post fetched successfully",
        posts: documents
      })
    })
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(
    post => {
      if(post) {
        res.send(post);
      }
      else {
        res.send({message: "post not found"})
      }
    }
  )
})

router.delete('/:id', checkAuth,  (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.send({ message: "post deleted successfully" });
    })
})

module.exports = router;
