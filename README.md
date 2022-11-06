# Blogging API Project

This is an api for a blog app. This API has a general endpoint that shows a list of articles that have been created by different people, and anybody that calls this endpoint, should be able to read a blog created by them or other users.

---

## Requirements

1. Users should have a first name, last name, email, password.
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs.
13. The endpoint should be paginated and filterable by state
14. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1.

---

## Setup

- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run dev`

---

## Base URL

- [My blog API base URL](https://safe-scrubland-60722.herokuapp.com/api/v1)

## Models

---

### User

| field     | data_type | constraints           |
| --------- | --------- | --------------------- |
| id        | string    | required              |
| firstName | string    | optional              |
| lastName  | string    | optional              |
| email     | string    | required              |
| password  | string    | required              |
| articles  | string    | reference: Blog model |

### Blog

| field        | data_type | constraints                                   |
| ------------ | --------- | --------------------------------------------- |
| id           | string    | required                                      |
| title        | string    | required , unique                             |
| state        | string    | default: "draft" enum: ['draft', 'published'] |
| description  | string    | optional                                      |
| author       | string    | required                                      |
| reading_time | string    | required                                      |
| read_count   | number    | required                                      |
| tags         | array     | required                                      |
| body         | atring    | required                                      |
| user         | string    | reference : User model                        |

## APIs

---

Visit this site for my [Postman documentation of the APIs](https://documenter.getpostman.com/view/22967625/2s8YYEQQgP)

---

## Test application

### Signup and login

```
ikemv@DESKTOP-85EPS4R MINGW64 ~/Blogging_API (main)
$ npm run test

> blogging_api@1.0.0 test
> jest --detectOpenHandles.unref()

  console.log
    Successfully Connected to MongoDB

      at NativeConnection.log (src/db/db_connect.js:11:13)

  console.log
    Successfully Connected to MongoDB

      at NativeConnection.log (src/db/db_connect.js:11:13)

POST /api/v1/auth/signup 201 8919.972 ms - 499
POST /api/v1/auth/login 200 260.462 ms - 202
PASS src/tests/auth.test.js (38.617 s)
  user signup and login
    √ should signup a new user (9469 ms)
    √ should login a user (304 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        39.855 s
Ran all test suites.


```

...

## Contributor

- Ikem Violacordis Ada
