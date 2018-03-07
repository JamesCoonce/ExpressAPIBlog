import {
    Router,
} from 'express';
import CustomerController from '../controllers/customer.controller';

const router = new Router();

// Get all Posts
router.get('/posts', (req, res) => {
    CustomerController.getAll(req, res);
});

// Get one post by cuid
router.get('/posts/:cuid', (req, res) => {
    CustomerController.getPost(req, res);
});

// Add a new Post
router.post('/posts', (req, res) => {
    CustomerController.addPost(req, res);
});

router.put('/posts/:cuid', (req, res) => {
    CustomerController.updatePost(req, res);
});

// Delete a post by cuid
router.delete('/posts/:cuid', (req, res) => {
    CustomerController.deletePost(req, res);
});
export default router;