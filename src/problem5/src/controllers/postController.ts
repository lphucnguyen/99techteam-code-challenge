import { Request, Response } from 'express';
import { IPostService } from '../services/postService';
import { StatusCodes } from 'http-status-codes';
import { CreatePostInputSchema } from '../dto/post/create';
import { GetAllPostsInputSchema } from '../dto/post/getAll';
import { UpdatePostInputSchema } from '../dto/post/update';

export class PostController {
    constructor(private postService: IPostService) {}

    createPost = async(req: Request, res: Response) => {
        const post = await this.postService.create(
            CreatePostInputSchema.parse(req.body)
        );

        res.status(StatusCodes.CREATED).json(post);
    };

    getPosts = async(req: Request, res: Response) => {
        const posts = await this.postService.getAll(
            GetAllPostsInputSchema.parse(req.query)
        );

        res.status(StatusCodes.OK).json(posts);
    };

    getPost = async(req: Request, res: Response) => {
        const postId = req.params.id;
        const post = await this.postService.get(postId);

        res.status(StatusCodes.OK).json(post);
    };

    updatePost = async(req: Request, res: Response) => {
        const postId = req.params.id;
        const post = await this.postService.update(postId,
            UpdatePostInputSchema.parse(req.body)
        );

        res.status(StatusCodes.OK).json(post);
    };

    deletePost = async(req: Request, res: Response) => {
        const postId = req.params.id;
        const post = await this.postService.delete(postId);

        res.status(StatusCodes.NO_CONTENT).json(post);
    };
}