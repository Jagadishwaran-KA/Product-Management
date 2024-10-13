How to run
0.Create a file .env in the router folder or rename the file .example.env to .env and add the postgres url
1.Install typescript && Run npm install
2.Run npm start

For database u can create ur own postgres sql using neon db (free) or just add the link in .env file which will be shared.

#Tech Stack Used

- Node Js
- Express Framework
- Zod - For Input Validation
- Typescript (ts-node for run time compilation)
- Database - Postgres Sql with Prisma ORM
- For Database I used Neon Db which offers us a free serverless postgres connection.
- Link for the Database url will be shared or u can use ur local database
- Tested the api Endpoints using Postman.

#Api Endpoints - For Ref

GET - /products - Paginated - /products/:id - Returns a Single Product which matches the id
POST - /products - Creates a Product with the Schema
PUT - /products/:id - Updates the Product (can be updated partially)
DELETE - /products/:id - Deletes the Product with the given id.

#If the id doesn't exist or if the user input is not validated properly we handled this using zod.

#Database Schema
id - autoincrement INTEGER
name - required String
price - required Float (Number)
description - optional String
category - required string
