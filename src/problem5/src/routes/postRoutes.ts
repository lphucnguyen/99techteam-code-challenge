import { Router } from 'express';
import pool from '../datasource/mysql';
import { PostService } from '../services/postService';
import { PostRepository } from '../repositories/postRepository';
import { PostController } from '../controllers/postController';

function createPostRoutes(controller: PostController): Router {
    const router = Router();

    router.post('/', controller.createPost);
    router.get('/', controller.getPosts);
    router.get('/:id', controller.getPost);
    router.put('/:id', controller.updatePost);
    router.delete('/:id', controller.deletePost);

    return router;
};

export function initPostRoute(): Router {
    const postRepository = new PostRepository(pool);
    const postService = new PostService(postRepository);
    const controller = new PostController(postService);

    return createPostRoutes(controller);
};