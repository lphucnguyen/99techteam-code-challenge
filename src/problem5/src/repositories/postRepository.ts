import { Pool } from 'mysql2/promise';
import { Post } from '../models/post';
import { CreatePostInputDTO } from '../dto/post/create';
import { v7 as uuid7 } from 'uuid';
import { GetAllPostsInputDTO } from '../dto/post/getAll';
import { UpdatePostInputDTO } from '../dto/post/update';
import config from '../config/config';
import { NotFoundError } from '../constants/error';

export interface IPostRepository {
    create(data: CreatePostInputDTO): Promise<Post>;
    getAll(filter: GetAllPostsInputDTO): Promise<Post[]>;
    getTotal(filter: GetAllPostsInputDTO): Promise<number>;
    get(id: string): Promise<Post>;
    update(id: string, data: UpdatePostInputDTO): Promise<Post>;
    delete(id: string): Promise<Post>;
}

export class PostRepository implements IPostRepository {
    constructor(private pool: Pool) {}

    async create(data: CreatePostInputDTO): Promise<Post> {
        const { title, content } = data;
        const id = uuid7();

        await this.pool.execute(
            'INSERT INTO posts (id, title, content, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
            [id, title, content]
        );

        return await this.get(id);
    }

    async getAll(filter: GetAllPostsInputDTO): Promise<Post[]> {
        const {
            page = 1,
            searchKey,
            sortBy,
            sortOrder = 'asc'
        } = filter;
        const params = [];
        let sql = 'SELECT * FROM posts';

        if (searchKey) {
            sql += ' WHERE title LIKE ?';
            const searchTerm = `%${searchKey}%`;
            params.push(searchTerm);
        }

        if (sortBy) {
            sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        }

        const offset = (page - 1) * config.perPage;
        sql += ' LIMIT ? OFFSET ?';
        params.push(config.perPage, offset);

        const [rows] = await this.pool.query(sql, params);

        return rows as Post[];
    }

    async getTotal(filter: GetAllPostsInputDTO): Promise<number> {
        const {
            searchKey,
            sortBy,
            sortOrder = 'asc'
        } = filter;
        const params = [];
        let sql = 'SELECT COUNT(id) as count FROM posts';

        if (searchKey) {
            sql += ' WHERE title LIKE ?';
            const searchTerm = `%${searchKey}%`;
            params.push(searchTerm);
        }

        if (sortBy) {
            sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        }

        const [rows] = await this.pool.query(sql, params);
        const result = rows as [{ count: number }];

        return result[0].count;
    }

    async get(id: string): Promise<Post> {
        const [rows] = await this.pool.query('SELECT * FROM posts WHERE id = ?', [id]);
        const posts = rows as Post[];

        if (posts.length === 0) {
            throw new NotFoundError();
        }

        return posts[0];
    }

    async update(id: string, data: UpdatePostInputDTO): Promise<Post> {
        const params = [];
        const setClause = Object.entries(data).map(item => {
            if (item[1]) {
                params.push(item[1]);

                return `${item[0]} = ?`;
            }
        }).join(',');

        params.push(id);

        await this.pool.execute(
            `UPDATE posts SET ${setClause} WHERE id = ?`,
            params
        );

        return await this.get(id);
    }

    async delete(id: string): Promise<Post> {
        const post = await this.get(id);

        await this.pool.execute('DELETE FROM posts WHERE id = ?', [id]);

        return post;
    }
}