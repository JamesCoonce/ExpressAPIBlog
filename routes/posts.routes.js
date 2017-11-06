import { Router } from 'express';
import PostController from '../controllers/post.controller';
const router = new Router();

// Get all Posts
router.get('/posts', (req, res) => {
    console.log('Get All Posts');
    PostController.getAll(req, res);
});

// Get one post by cuid
router.get('/posts/:cuid', (req, res) =>{
    PostController.getPost(req,res);
});

// Add a new Post
router.post('/posts', (req, res) => {
    console.log('Create post');
    PostController.addPost(req, res);
});

router.put('/posts/:cuid', (req, res) => {
    console.log('Update post');
    PostController.updatePost(req, res);
});

// Delete a post by cuid
router.delete('/posts/:cuid', (req, res) => {
    PostController.deletePost(req, res);
});
export default router;