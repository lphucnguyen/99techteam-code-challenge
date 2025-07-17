import request from 'supertest';
import dotenv from 'dotenv';
import { Application } from 'express';
import { Pool, RowDataPacket } from 'mysql2/promise';
import { StatusCodes } from 'http-status-codes';
import { v7 as uuid7 } from 'uuid';

dotenv.config({ path: '.env.test' });

import app from '../../app';
import pool from '../../datasource/mysql';

interface Post extends RowDataPacket {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

describe('API Post integration tests', () => {
    let expressApp: Application;
    let dbPool: Pool;
    let server: any;

    beforeAll(async () => {
        expressApp = app;
        dbPool = pool;

        try {
            await dbPool.getConnection();
            console.log('Connected to test database.');
        } catch (error) {
            console.error('Failed to connect to test database:', error);
            process.exit(1);
        }

        const testPort = process.env.PORT || 3001;
        server = expressApp.listen(testPort);
    });

    afterAll(async () => {
        await new Promise(resolve => server.close(resolve));
        console.log('Test server closed.');

        await dbPool.end();
        console.log('Test database pool closed.');
    });

    beforeEach(async () => {
        try {
            await dbPool.execute('DELETE FROM posts');
            console.log('Database cleaned.');
        } catch (error) {
            console.error('Failed to clean database:', error);
            throw error;
        }
    });

    const insertTestPost = async (title: string, content: string): Promise<Post> => {
        const id = uuid7();

        await dbPool.execute(
            'INSERT INTO posts (id, title, content, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
            [id, title, content]
        );

        const [rows] = await dbPool.execute('SELECT * FROM posts WHERE id = ?', [id]);
        return (rows as Post[])[0];
    };

    describe('Create a post', () => {
        it('should create a new post with valid data', async () => {
            const newPostData = {
                title: 'Post 1',
                content: 'Post 1 content',
            };

            await request(expressApp)
                .post('/posts')
                .send(newPostData)
                .expect(StatusCodes.CREATED);

            const [rows]: [Post[], any] = await dbPool.execute('SELECT * FROM posts');
            expect(rows.length).toBe(1);
        });

        it('should return 400 if title is missing', async () => {
            const newPostData = {
                content: 'This is the content without a title.',
            };

            await request(expressApp)
                .post('/posts')
                .send(newPostData)
                .expect(StatusCodes.BAD_REQUEST);
        });

        it('should return 400 if content is missing', async () => {
            const newPostData = {
                title: 'Test Post Title',
            };

            await request(expressApp)
                .post('/posts')
                .send(newPostData)
                .expect(StatusCodes.BAD_REQUEST);
        });
    });

    describe('Get all posts', () => {
        it('should return an empty array if no posts exist', async () => {
            const response = await request(expressApp)
                .get('/posts')
                .expect(StatusCodes.OK);

            expect(response.body.data).toEqual([]);
            expect(response.body.pagination.total).toBe(0);
        });

        it('should return all posts with default pagination and sorting', async () => {
            await insertTestPost('Post 1', 'Content 1');
            await insertTestPost('Post 2', 'Content 2');

            const response = await request(expressApp)
                .get('/posts')
                .expect(StatusCodes.OK);

            expect(response.body.data.length).toBe(2);
            expect(response.body.pagination.total).toBe(2);
        });

        it('should return post 1 when get by searchKey', async () => {
            await insertTestPost('Post_1', 'Post 1 content');
            await insertTestPost('Post_2', 'Post 2 content');

            const response = await request(expressApp)
                .get('/posts?searchKey=Post_1')
                .expect(StatusCodes.OK);

            expect(response.body.data.length).toBe(1);
            expect(response.body.pagination.total).toBe(1);
        });

        it('should return post that apply limit and page', async () => {
            await insertTestPost('Post 1', 'Post 1 content');
            await insertTestPost('Post 2', 'Post 2 content');
            await insertTestPost('Post 3', 'Post 3 content');
            await insertTestPost('Post 4', 'Post 4 content');
            await insertTestPost('Post 5', 'Post 5 content');
            await insertTestPost('Post 6', 'Post 6 content');
            await insertTestPost('Post 7', 'Post 7 content');
            await insertTestPost('Post 8', 'Post 8 content');
            await insertTestPost('Post 9', 'Post 9 content');
            await insertTestPost('Post 10', 'Post 10 content');
            await insertTestPost('Post 11', 'Post 11 content');

            const response = await request(expressApp)
                .get('/posts?page=2')
                .expect(StatusCodes.OK);

            expect(response.body.data.length).toBe(1);
            expect(response.body.pagination.total).toBe(11);
        });

        it('should return post that apply sorting by title', async () => {
            await insertTestPost('Post 1', 'Post 1 content');
            await insertTestPost('Post 2', 'Post 2 content');
            await insertTestPost('Post 3', 'Post 3 content');

            const response = await request(expressApp)
                .get('/posts?sortBy=title&sortOrder=asc')
                .expect(StatusCodes.OK);

            expect(response.body.data.length).toBe(3);
        });

        it('should return 400 for invalid sortBy parameter', async () => {
            await request(expressApp)
                .get('/posts?sortBy=invalidColumn')
                .expect(StatusCodes.BAD_REQUEST);
        });
    });

    describe('Get post by id', () => {
        it('should return a post by id', async () => {
            const createdPost = await insertTestPost('Post 1', 'Post 1 content');

            const response = await request(expressApp)
                .get(`/posts/${createdPost.id}`)
                .expect(StatusCodes.OK);

            expect(response.body.id).toBe(createdPost.id);
            expect(response.body.title).toBe(createdPost.title);
            expect(response.body.content).toBe(createdPost.content);
        });

        it('should return 404 if post does not exist', async () => {
            const id = 'example-non-existent-id';

            await request(expressApp)
                .get(`/posts/${id}`)
                .expect(StatusCodes.NOT_FOUND);
        });
    });

    describe('Update Post', () => {
        it('should update an existing post', async () => {
            const createdPost = await insertTestPost('Post 1', 'Post 1 content');
            const updatedData = {
                title: 'Post 1 updated',
                content: 'Post 1 content updated',
            };

            await request(expressApp)
                .put(`/posts/${createdPost.id}`)
                .send(updatedData)
                .expect(StatusCodes.OK);

            const [rows]: [Post[], any] = await dbPool.execute('SELECT * FROM posts WHERE id = ?', [createdPost.id]);

            expect(rows.length).toBe(1);
            expect(rows[0].title).toBe(updatedData.title);
            expect(rows[0].content).toBe(updatedData.content);
        });

        it('should return 404 if update a post does not exist', async () => {
            const id = uuid7();
            const updatedData = { title: 'Non Existent', content: 'Post' };

            await request(expressApp)
                .put(`/posts/${id}`)
                .send(updatedData)
                .expect(StatusCodes.NOT_FOUND);
        });

        it('should return 400 for invalid update data', async () => {
            const createdPost = await insertTestPost('Valid Post Title', 'Valid Content');
            const invalidData = { title: 'Invalid Post Title', content: '' };

            await request(expressApp)
                .put(`/posts/${createdPost.id}`)
                .send(invalidData)
                .expect(StatusCodes.BAD_REQUEST);
        });
    });

    describe('Delete Post', () => {
        it('should delete an existing post', async () => {
            const createdPost = await insertTestPost('Post to Delete', 'Content to delete');

            await request(expressApp)
                .delete(`/posts/${createdPost.id}`)
                .expect(StatusCodes.NO_CONTENT);

            const [rows]: [Post[], any] = await dbPool.execute('SELECT * FROM posts WHERE id = ?', [createdPost.id]);
            expect(rows.length).toBe(0);
        });

        it('should return 404 if delete a post does not exist', async () => {
            const id = 'example-non-existent-id';

            const response = await request(expressApp)
                .delete(`/posts/${id}`)
                .expect(StatusCodes.NOT_FOUND);

            expect(response.body.message).toBe('Resource not found');
        });
    });
});