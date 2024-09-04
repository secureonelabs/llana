
  <a href="https://juicyllama.com/" target="_blank">
    <img src="https://juicyllama.com/assets/images/icon.png" width="100" alt="JuicyLlama Logo" />
  </a>

Visit [JuicyLlama > Tools > Llana](https://juicyllama.com/tools/llana) for full installation instructions, documentation and community. 

## Databases

We are working to support all major databases, if you would like to contribute to the open source project and help integrate your faviourt database, checkout our [contribiution guidelines](https://juicyllama.com/developers/contributing).

- [ ] [ORACLE](https://expressjs.com/en/guide/database-integration.html#oracle) (Help Wanted)
- [x] [MYSQL](https://expressjs.com/en/guide/database-integration.html#mysql) (In Progress)
- [ ] MSSQL (Help Wanted)
- [ ] [POSTGRES](https://expressjs.com/en/guide/database-integration.html#postgresql) (Help Wanted)
- [ ] [MONGODB](https://expressjs.com/en/guide/database-integration.html#mongodb) (Help Wanted)
- [ ] [REDIS](https://expressjs.com/en/guide/database-integration.html#redis) (Help Wanted)
- [ ] SNOWFLAKE (Help Wanted)
- [ ] [ELASTICSEARCH](https://expressjs.com/en/guide/database-integration.html#elasticsearch) (Help Wanted)
- [ ] [SQLITE](https://expressjs.com/en/guide/database-integration.html#sqlite) (Help Wanted)
- [ ] [CASSANDRA](https://expressjs.com/en/guide/database-integration.html#cassandra) (Help Wanted)
- [ ] MARIADB (Help Wanted)

[See the complete breakdown of which databases are integrated with which endpoints](#database-support)

## TODO:


- [ ] Move these docs to juicyllama.com/llana, landing page + docs

- [ ] Add redis support for faster performance (e.g. schema caching, user_identity)

- [ ] containerize and publish to docker

- [ ] move remaining items to github issues

        - [ ] TODO: use on first external client project (no needed in github - Ampli)

- [ ] full test coverage

        - [ ] App Boot
        - [ ] Helpers / Database
        - [ ] Helpers / Encryption
        - [ ] Helpers / Logger
        - [ ] Helpers / Query
        - [ ] Helpers / Schema (pay special attention to data validation)
        - [ ] Helpers / Sort

- [ ] bulk endpoints (create, update, upsert, delete)

- [ ] add UUID or something to track each request and include in any response / error for better logging / debugging

- [ ] add column exclusions (global and by table, e.g. deleted_at, password)

- [ ] Adding more database integrations (postgres, etc)

- [ ] on postinstall a script to generate a randomly secure JWT_KEY for the .env file

- [ ] Interface for managing configuration

- [ ] Scope Llana cloud option for non-technical users
    - [ ] Auto deployment with docker
    - [ ] Pricing & request volumes 

- [ ] Scope out Setup / Install service (pay to deploy on your database)

- [ ] Add GraphQL Layer

- [ ] Support other authentication methods (2FA, Fingerprint, Oauth2, etc)

- [ ] Security  
    - [ ] Pen testing
    - [ ] Failed auth lockout
    - [ ] Request throttling

- [ ] Upsert (PATH) endpoint (user may specify fields to compare, also/fallback to Unique Keys) -> update if exists otherwise create

- [ ] Charting GET `*/chart` endpoint

- [ ] Fix end-2-end test "socket hangup issue"

#### Marketing

- [ ] Build integrations with workflow automation tooling (n8n, zapier, make, etc) and promote on their platforms where possible

- [ ] Publish on Daily.dev, ProductHunt, etc 

- [ ] Commend on Medium posts like: https://javascript.plainenglish.io/my-tech-stack-for-building-web-apps-today-43398556bb4d introducing the plugin

- [ ] Basic PPC campaign


## Installation 

```bash
npm i -g @juicyllama/llana
npm install
```

## Configutation

### Database

Replace the database connection string `DATABASE_URI` in the `.env` file.

### Authentication 

We currently support two types of authentication:

#### API KEY

By defualt, this expects a table named `UserApiKey` with the field `apiKey`, you can override these settings in in the `src/config/auth.config.ts` file.

#### JWT Token 

We provide a special extra endpoint, the only one not generated based on your database schema. 

* `/login`

This `POST` endpoint will take the users login credentials and return back a JWT token, which can be used as authentication for other endpoints (see Restrictions below).

By defualt, this expects a table named `User` with the fields `email` and `password`, you can override these settings in in the `src/config/auth.config.ts` file.

Example Request:

```
POST `/login`

body: {
  email: test@test.com,
  password: test
}

```

Example Response: 

```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTcyNTM1NDI4OCwiZXhwIjoxNzI1NDQwNjg4fQ.Wb_Y6y1Mkb0xrhUX57s2XlKtqeZ5L68wNCVMWT8wFJw"
}
```

#### Routes

By default any authentications required will apply to all endpoints, you can add exclusions to the config. There is an option to add inclusions for more granular inclusion/exclusion support.

This allows you to open and close specific endpoints to the public.
</div>

### Roles

User roles are an important part of granting the correct permissions to perform relevent actions on the API endpoints.

By default, everything is locked down and no actions can be performed (`NONE`). You can set role `defualts` which will be the fallback if no specific table role permissions have been added.

We provide a defualt configutation you can update/expand `src/config/roles.config.ts`

You can grant roles the ability to `DELETE` which means they can also `READ` and `WRITE`, granting `WRITE` access also allows users to `READ` and finally `READ` access is just that. If you don't want to give a role any permissions then use `NONE`

If the user has insufficent permmissions they will get a `403 Forbidden` response.

*Note:* User roles work in combination with [Authentication](#authentication), if you don't have authentications setup, your API will be fully open and roles do not apply.   

## Building Requests

### Fields

You can specify which fields you would like to return, defualts to `*`

Example `?fields=orderId,shipName,Customer.ContactName`

Note, if you pass deep fields (table.column) then you must pass the table as a relation also.

### Relations

You can fetch deeper content by passing relations, assuming their is a forign key connection it will return the deep result.

Example `?relations=Customer`

### Pagination 

Pass page into requests to load a specific page result, in the `/list` response you will find the following:

```
"pagination": {
        "total": number, //total results in this page
        "page": {
            "current": string, //the page ref for the current page
            "prev": string, //the page ref for the previous page (if applicable)
            "next": string, //the page ref for the next page (if applicable)
            "first": string,
            "last": string
        }
    },
```

- page (either `next` or `prev` from existing result - helps with pagination)

### Filtering

format is column[operator]=value with operator being from the enum WhereOperator 
      
Example: `?city=Barcelona` or `?city[equals]=Barcelona`

### Sorting

format is sort={column}.{direction},column.{direction}

`?sort=contactName.asc,custId.desc`

### Joining

By default joins are handled at a code level, building objects in your responses. However if you would prefer to handle joins at a database level, better performance but slightly more problematic to "wire up". Pass `&join=DATABASSE` to your requests.

## Endpoints

For every table in your database, you will automatically have access to the following endpoints:

- TODO: Create (POST)
  - TODO: Single `*/`
- Read (GET)
  - By Id `*/:id`
  - Many `*/`
- TODO: Update (PUT)
  - TODO: By Id `*/:id`
- TODO: Delete (DELETE)
  - TODO: By Id `*/:id`


### Read One (By ID)

Endpoint: `*/:id`

Example Request:

```
GET `/User/1?fields=role,id`
```

Example Response: 

```
{"role":"ADMIN","id":1}
```

### Read One

Endpoint: `*/`

Example Request:

```
GET `/User/1?fields=role,id`
```

Example Response: 

```
{"role":"ADMIN","id":1}
```

### Read All

Endpoint: `*/list`

```
GET `/User/list`
```

Response Schema: 

```
{
    "limit": number, //records returned for this page
    "offset": number, //the current offset value
    "total": number, //total records for all pages
    "pagination": {}, //see pagination
    "data": [...records]
}
```

Example Response: 

```
{
    "limit": 20,
    "offset": 0,
    "total": 1,
    "pagination": {
        "total": 1,
        "page": {
            "current": "eyJsaW1pdCI6MjAsIm9mZnNldCI6MH0=",
            "prev": null,
            "next": null,
            "first": "eyJsaW1pdCI6MjAsIm9mZnNldCI6MH0=",
            "last": "eyJsaW1pdCI6MjAsIm9mZnNldCI6MH0="
        }
    },
    "data": [
        {
            "id": 1,
            "email": "email@email.com",
            "password": "**********",
            "role": "ADMIN",
            "first_name": "Jon",
            "last_name": "Doe",
        }
    ]
}
```


## Docker Demos

Out of the box you can use our docker demo data to play with the system. 

We are using this helpful [database sample repository](https://github.com/harryho/db-samples) to build demo database examples. We add a `User` table and a `UserApiKey` table to facilitate the authentication. 

You can use the following user details for testing:

Email: `test@test.com`
Password: `test`
API key: `Ex@mp1eS$Cu7eAp!K3y`


## Database Support

| ENDPOINT | ORACLE | MYSQL | MSSQL | POSTGRES | MONGODB | REDIS | SNOWFLAKE | ELASTICSEARCH | SQLITE | CASSANDRA | MARIADB |
|---|-|-|-|-|-|-|-|-|-|-|-|
|GET `*/:id` ||✅||||||||||
|GET `*/` ||✅||||||||||
|GET `*/list` ||✅||||||||||
|POST `/login` ||✅||||||||||
|POST `*/` ||✅||||||||||
|PUT `/:id` ||✅||||||||||
|DELETE `/:id` ||✅||||||||||