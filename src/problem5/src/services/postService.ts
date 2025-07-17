import config from '../config/config';
import Pagination from '../constants/pagination';
import { CreatePostInputDTO } from '../dto/post/create';
import { GetAllPostsInputDTO } from '../dto/post/getAll';
import { UpdatePostInputDTO } from '../dto/post/update';
import { Post } from '../models/post';
import { IPostRepository } from '../repositories/postRepository';

export interface IPostService {
    create(data: CreatePostInputDTO): Promise<Post>;
    getAll(filter: GetAllPostsInputDTO): Promise<Pagination<Post>>;
    get(id: string): Promise<Post>;
    update(id: string, data: UpdatePostInputDTO): Promise<Post>;
    delete(id: string): Promise<Post>;
}

export class PostService implements IPostService {
    constructor(private repository: IPostRepository) {}

    async create(data: CreatePostInputDTO): Promise<Post> {
        return await this.repository.create(data);
    }

    async getAll(filter: GetAllPostsInputDTO): Promise<Pagination<Post>> {
        const [posts, total] = await Promise.all([
            this.repository.getAll(filter),
            this.repository.getTotal(filter)
        ]);

        const pagination = {
            total,
            totalPages: Math.ceil(total / config.perPage),
            currentPage: filter.page || 1,
        };

        return new Pagination(posts, pagination);
    }

    async get(id: string): Promise<Post> {
        return await this.repository.get(id);
    }

    async update(id: string, data: UpdatePostInputDTO): Promise<Post> {
        return await this.repository.update(id, data);
    }

    async delete(id: string): Promise<Post> {
        return await this.repository.delete(id);
    }
}