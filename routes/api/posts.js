const express = require('express');
const router = express.Router();
const { check, validationResult, validatePostInput } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route POST api/posts
router.post('/',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch(err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET api/posts
router.get('/', auth, async (req,res) => {
  try {
    const posts = await Post.find().sort({ date: -1});
    res.json(posts);
  } catch(err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/posts/:id
router.get('/:id', auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found'});
    }

    res.json(post);
  } catch(err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found'});
    }

    res.status(500).send('Server Error');
  }
});

// @route DELETE api/posts/:id
router.delete('/:id', auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found'});
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized'});
    }

    await post.remove();

    res.json({ msg: 'Post removed'});
  } catch(err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found'});
    }

    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like post
// @access  Private
router.put(
  '/like/:id',
  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (
        post.likes.filter(like => like.user.toString() === req.user.id)
          .length > 0
      ) {
        return res
          .status(400)
          .json({ alreadyliked: 'User already liked this post' });
      }

      post.likes.unshift({ user: req.user.id });

      await post.save();
      res.json(post.likes);
    } catch(err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.put(
  '/unlike/:id',
  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (
        post.likes.filter(like => like.user.toString() === req.user.id)
          .length > 0
      ) {
        return res
          .status(400)
          .json({ alreadyunliked: 'User already unliked this post' });
      }

      const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);

      await post.save();
      res.json(post.likes);
    } catch(err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      post.comments.unshift(newComment);
      await Post.save();

      res.json(post.comments);
    } catch(err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comment = post.comments
        .find(comment => comment.id === req.params.comment_id);

      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found'});
      }
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized'});
      }

      // Get remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      post.comments.splice(removeIndex, 1);

      await post.save();

      res.json(post.comments);
    } catch(err) {
      console.log(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Comment not found'});
      }

      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;