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

- [My blog API base URL](https://blog-api-5rad.onrender.com/api/v1/)

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

### Signup User

- Route: api/v1/signup
- Method: POST
- Body:

```
{
    "firstName": "ikem",
    "lastName": "Violacordis",
    "email":"violacordis@gmail.com",
    "password": "123456789"
}
```

- Responses

Success

```
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjYyZjAxYzM1NGVhNDY0ODIyN2EwZiIsImlhdCI6MTY2NzY0MTA4OSwiZXhwIjoxNjY3NjQ0Njg5fQ.X0V1yboBw4WotonW_pdROM14rYwxWCN0Q_5KPDAD-A8",
    "data": {
        "user": {
            "firstName": "ikem",
            "lastName": "Violacordis",
            "email": "violacordis@gmail.com",
            "password": "$2b$10$DPH1479hvLtHNDBL/rWm0.ADeJZ/bHRUt8BnHGwRFi99Oz9lTelFO",
            "articles": [],
            "_id": "63662f01c354ea4648227a0f",
            "createdAt": "2022-11-05T09:38:09.232Z",
            "updatedAt": "2022-11-05T09:38:09.232Z",
            "__v": 0
        }
    }
}
```

---

### Login User

- Route: api/v1/login
- Method: POST
- Body:

```
{
    "email":"violacordis@gmail.com",
    "password": "123456789"
}
```

- Responses

Success

```
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjYyZjAxYzM1NGVhNDY0ODIyN2EwZiIsImlhdCI6MTY2NzY0MTExMywiZXhwIjoxNjY3NjQ0NzEzfQ._U9DKPgjBKmCeAf-MRKf6AN2oJ_Fh6wddcmST3okCxs"
}
```

---

### Create Article

- Route: /api/v1/blog
- Method: POST
- Header
  - Authorization: Bearer {token From Login}
- Body:

```
  {
    "title": "Who is a software engineer?",
    "description": "software engineer",
    "state": "draft",
    "tags": [ "software"],
    "body" : " iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate."
}
```

- Responses

Success

```
{
    "status": "success",
    "message": "Article created successfully",
    "data": {
        "blog": {
            "title": "Who is a software engineer?",
            "description": "software engineer",
            "author": "ikem Violacordis",
            "state": "draft",
            "read_count": 0,
            "reading_time": "2 min read",
            "tags": [
                "software"
            ],
            "body": " iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate.",
            "user": "63662f01c354ea4648227a0f",
            "_id": "63662f57c354ea4648227a14",
            "createdAt": "2022-11-05T09:39:35.063Z",
            "updatedAt": "2022-11-05T09:39:35.063Z",
            "__v": 0
        }
    }
}
```

---

## General Endpoints accessible to both logged in and non logged in users.

---

### Get all articles (Published articles).

- Route: /api/v1/blog
- Method: GET
- Query params : Present
- Request

```
  https://safe-scrubland-60722.herokuapp.com/api/v1/blog?sort=-createdAt

```

- Responses

  Success

```
{
    "status": "success",
    "result": 4,
    "current_page": 1,
    "limit": 20,
    "total_pages": 1,
    "data": {
        "publishedArticles": [
            {
                "_id": "6366280ac354ea46482279f0",
                "title": "Backend development",
                "description": "what is backend development?",
                "author": "Adam Vee",
                "state": "published",
                "read_count": 2,
                "reading_time": "2 min read",
                "tags": [
                    "backend",
                    "developer"
                ],
                "body": " iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate.",
                "user": {
                    "_id": "63662725c354ea46482279ec",
                    "firstName": "Adam",
                    "lastName": "Vee"
                },
                "createdAt": "2022-11-05T09:08:26.097Z",
                "updatedAt": "2022-11-05T09:36:22.079Z",
                "__v": 0
            },
            {
                "_id": "6365763be6942a2e7c32908f",
                "title": "Testing my blog API",
                "description": "Testing the API",
                "author": "Ada Viola",
                "state": "published",
                "read_count": 2,
                "reading_time": "2 min read",
                "tags": [
                    "Testing"
                ],
                "body": "os et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate.",
                "user": {
                    "_id": "636575b8e6942a2e7c32908a",
                    "firstName": "Ada",
                    "lastName": "Viola"
                },
                "createdAt": "2022-11-04T20:29:47.882Z",
                "updatedAt": "2022-11-04T20:40:30.990Z",
                "__v": 0
            },
            {
                "_id": "6365755be6942a2e7c329082",
                "title": "Hello World",
                "description": "Saying hello to the world",
                "author": "Wendy Alvicci",
                "state": "published",
                "read_count": 0,
                "reading_time": "2 min read",
                "tags": [
                    "hello"
                ],
                "body": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate.",
                "user": {
                    "_id": "636574dfe6942a2e7c32907e",
                    "firstName": "Wendy",
                    "lastName": "Alvicci"
                },
                "createdAt": "2022-11-04T20:26:03.495Z",
                "updatedAt": "2022-11-04T20:26:03.495Z",
                "__v": 0
            },
            {
                "_id": "63655a03d21b2824bbd2c78f",
                "title": "lorem ipsum 2",
                "description": "lorem ipsum",
                "author": "Ikem Ada",
                "state": "published",
                "read_count": 0,
                "reading_time": "5 min read",
                "tags": [
                    "lorem"
                ],
                "body": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate. Mauris sed elit ac lorem gravida imperdiet. Pellentesque et ante lacus. Suspendisse semper leo a lorem bibendum tincidunt. Aliquam sed ligula libero. Integer tincidunt vulputate erat sit amet pulvinar. Curabitur fermentum nibh ut arcu placerat gravida. Proin facilisis nec erat et ullamcorper. Vivamus eros ipsum, porta et mollis a, convallis ac quam. Fusce eget nisi sagittis, sagittis dolor ut, pellentesque diam. Phasellus dignissim molestie nisl nec convallis to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate. Mauris sed elit ac lorem gravida imperdiet. Pellentesque et ante lacus. Suspendisse semper leo a lorem bibendum tincidunt. Aliquam sed ligula libero. Integer tincidunt vulputate erat sit amet pulvinar. Curabitur fermentum nibh ut arcu placerat gravida. Proin facilisis nec erat et ullamcorper. Vivamus eros ipsum, porta et mollis a, convallis ac quam. Fusce eget nisi sagittis, sagittis dolor ut, pellentesque diam. Phasellus dignissim molestie nisl nec convallis to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate. Mauris sed elit ac lorem gravida imperdiet. Pellentesque et ante lacus. Suspendisse semper leo a lorem bibendum tincidunt. Aliquam sed ligula libero. Integer tincidunt vulputate erat sit amet pulvinar. Curabitur fermentum nibh ut arcu placerat gravida. Proin facilisis nec erat et ullamcorper. Vivamus eros ipsum, porta et mollis a, convallis ac quam. Fusce eget nisi sagittis, sagittis dolor ut, pellentesque diam. Phasellus dignissim molestie nisl nec convallis to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate. Mauris sed elit ac lorem gravida imperdiet. Pellentesque et ante lacus. Suspendisse semper leo a lorem bibendum tincidunt. Aliquam sed ligula libero. Integer tincidunt vulputate erat sit amet pulvinar. Curabitur fermentum nibh ut arcu placerat gravida. Proin facilisis nec erat et ullamcorper. Vivamus eros ipsum, porta et mollis a, convallis ac quam. Fusce eget nisi sagittis, sagittis dolor ut, pellentesque diam. Phasellus dignissim molestie nisl nec convallis.",
                "user": {
                    "_id": "63655971d21b2824bbd2c785",
                    "firstName": "Ikem",
                    "lastName": "Ada"
                },
                "createdAt": "2022-11-04T18:29:23.642Z",
                "updatedAt": "2022-11-04T18:29:23.642Z",
                "__v": 0
            }
        ]
    }
}

```

---

### Get an article by ID (Published article).

- Route: /api/v1/blog/:id
- Method: GET
- - Request

```
  https://safe-scrubland-60722.herokuapp.com/api/v1/blog/6366280ac354ea46482279f0

```

- Responses

  Success

```
{
    "status": "success",
    "article": {
        "_id": "6366280ac354ea46482279f0",
        "title": "Backend development",
        "description": "what is backend development?",
        "author": "Adam Vee",
        "state": "published",
        "read_count": 3,
        "reading_time": "2 min read",
        "tags": [
            "backend",
            "developer"
        ],
        "body": " iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate.",
        "user": {
            "_id": "63662725c354ea46482279ec",
            "firstName": "Adam",
            "lastName": "Vee"
        },
        "createdAt": "2022-11-05T09:08:26.097Z",
        "updatedAt": "2022-11-05T09:36:22.079Z",
        "__v": 0
    }
}

```

---

## Author (Owner of articles) Endpoints.

---

### Get all author's articles ( Both published & Draft)

- Route: /api/v1/blog/articles/:id
- Method: GET
- Header
  - Authorization: Bearer {token From Login}
- Request

```
https://safe-scrubland-60722.herokuapp.com/api/v1/blog/articles/63662f01c354ea4648227a0f

```

- Response

  Success

```
{
    "status": "success",
    "result": 1,
    "data": {
        "articles": [
            {
                "_id": "63662f57c354ea4648227a14",
                "title": "Who is a software engineer?",
                "description": "software engineer",
                "author": "ikem Violacordis",
                "state": "draft",
                "read_count": 0,
                "reading_time": "2 min read",
                "tags": [
                    "software"
                ],
                "body": " iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate.",
                "user": {
                    "_id": "63662f01c354ea4648227a0f",
                    "firstName": "ikem",
                    "lastName": "Violacordis"
                },
                "createdAt": "2022-11-05T09:39:35.063Z",
                "updatedAt": "2022-11-05T09:39:35.063Z",
                "__v": 0
            }
        ]
    }
}

```

---

### Update article by author.

- Route: /api/v1/blog/articles/:id
- Method: PUT
- Header
  - Authorization: Bearer {token From Login}
- Request

```
https://safe-scrubland-60722.herokuapp.com/api/v1/blog/articles/63662f57c354ea4648227a14

```

```
{
    "state" : "published"
}

```

- Response

  Success

```
{
    "status": "success",
    "data": {
        "updatedArticle": {
            "_id": "63662f57c354ea4648227a14",
            "title": "Who is a software engineer?",
            "description": "software engineer",
            "author": "ikem Violacordis",
            "state": "published",
            "read_count": 0,
            "reading_time": "2 min read",
            "tags": [
                "software"
            ],
            "body": " iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris maximus scelerisque mi a auctor. Maecenas ipsum sapien, vestibulum sit amet varius a, molestie ac elit. In commodo mauris quam. Nam vestibulum neque a semper gravida. Aliquam consectetur magna vel nisl convallis vulputate.",
            "user": "63662f01c354ea4648227a0f",
            "createdAt": "2022-11-05T09:39:35.063Z",
            "updatedAt": "2022-11-05T09:44:24.215Z",
            "__v": 0
        }
    }
}

```

---

### Delete article by author.

- Route: /api/v1/blog/articles/:id
- Method: DELETE
- Header
  - Authorization: Bearer {token From Login}
- Request

```
  https://safe-scrubland-60722.herokuapp.com/api/v1/blog/articles/63662f57c354ea4648227a14

```

- Response

  Success

```
{
    "status": "success",
    "message": "Article deleted successfully"
}

```

---

### Visit this site for my [Postman documentation of the APIs](https://documenter.getpostman.com/view/22967625/2s8YYEQQgP)

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
