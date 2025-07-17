# Problem 5: A Crude Server

## Requmirement

A Crude Server built with TypeScript, Express, MySQL

```
problem5/
├── src/
    ├── __test__.     # Integration test
    ├── config.       # Environment configuration
    ├── controllers   # Handle HTTP requests/responses
    ├── datasource.   # Datasource
    ├── dto.          # Request/response validation
    ├── middlewares.  # Middleware
    ├── models.       # Model
    ├── repositories. # Data access layer
    ├── routes.       # Router
    ├── services.     # Business logic layer
```

### Features
- Create a subscriber
- List subscribers
- Get details of a subscriber
- Update a subscriber
- Get details of a subscriber

### Docker

- Run application by docker
```
docker-compose up -d
```

- Shut down application
```
docker-compose down
```

### Local development

1. Install node_modules
```
npm i
```

2. Create .env file
```
cp .env.example .env
```

3. Create .env.test file
```
cp .env.example .env.test
```

4. Run integration test
```
npm run apitest
```

5. Start application
```
npm run dev
```

### API

1. List Posts: GET `/posts?page=&sortBy=&sortOrder=&searchKey=`

Response
```
{
  "data": [
    {
      "id": "019809a7-cf88-73a9-a202-9080cfe6d771",
      "title": "Post 1",
      "content": "Post 1",
      "createdAt": "2025-07-14T15:57:29.000Z",
      "updatedAt": "2025-07-14T15:57:29.000Z"
    },
    {
      "id": "019809a7-e9ed-76eb-8371-a19705e8179f",
      "title": "Post 2",
      "content": "Post 2",
      "createdAt": "2025-07-14T15:57:36.000Z",
      "updatedAt": "2025-07-14T15:57:36.000Z"
    }
  ],
  "pagination": {
    "total": 2,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

2. Create a Post: POST `/posts`

Response
```
{
    "id": "019809a7-cf88-73a9-a202-9080cfe6d771",
    "title": "Post 1",
    "content": "Post 1",
    "createdAt": "2025-07-14T15:57:29.000Z",
    "updatedAt": "2025-07-14T15:57:29.000Z"
}
```

3. Update a Post: PUT `/posts/:id`

Request
```
{
    "title": "Post 1",
    "content": "Post 1"
}
```

Response
```
{
    "id": "019809a7-cf88-73a9-a202-9080cfe6d771",
    "title": "Post 1",
    "content": "Post 1",
    "createdAt": "2025-07-14T15:57:29.000Z",
    "updatedAt": "2025-07-14T15:57:29.000Z"
}
```

3. Delete a Post: DELETE `/posts/:id`

Response
```
{
    "id": "019809a7-cf88-73a9-a202-9080cfe6d771",
    "title": "Post 1",
    "content": "Post 1",
    "createdAt": "2025-07-14T15:57:29.000Z",
    "updatedAt": "2025-07-14T15:57:29.000Z"
}
```