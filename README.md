## Stuneckt Backend Assignment

Live: https://stuneckt-frontend-assignment.vercel.app/

In this assignment I have implmented the following features:
- User authentication using email and password (jwt based)
- Create Post
- Get all the followers of the users
- Update users detail
- Get all posts
- Get all posts made by a user
- Get users details

I have also implemented the bonus tasks:
- I have created a simple frontend to show the working of this api
- I have added the user authentication using email and password
- I have added a feeder script which can be used to populate the database with some initial user

### Follow the below steps to run the api locally

#### Step 1:
Clone the repository using this command

`https://github.com/ritik48/stuneckt-assignment.git`

#### Step 2:

Make sure you have typescript installed, if not use the follwing command to install the typescript

`npm install -g tsc`

#### Step 3:

Navigate to this projects folder

`cd stuneckt-assignment`

#### Step 4:
Install all the packages that is required for this project

`npm install`

#### Step 5:

Now start the server using following command:

`node ./dist/index.js`

This will start server on url: http://localhost:3000

Now, it can be tested using postman.

#### Step 6:

To insert some random data into database run the following command to execute the feeder script

`node ./dist/utils/seeder.js`



### Available Routes

**GET    /user**$~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~$: it will return the currently logged in user (if any)

**PATCH  /user**$~~~~~~~~~~~~~~~~~~~~~~~~~~~~$: it is used to update user detail like username

**POST   /user/login**$~~~~~~~~~~~~~~~~~~~~$: it is used to login the user (requires username and password as an input)

**POST   /user/signup**$~~~~~~~~~~~~~~~~$: it is used to register new user

**POST   /user/logout**$~~~~~~~~~~~~~~~~$: it is used to logout the user

**GET    /user/:id**$~~~~~~~~~~~~~~~~~~~~~~~~~~$: it is used to get a user with a particular id

**GET    /user/:id/followers**$~~~~~~~~$: it is used to get the followers of a user with a particular id

**GET    /post**$~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~$: it will return all the posts in the databse

**POST   /post**$~~~~~~~~~~~~~~~~~~~~~~~~~~~$: it is used to create a new post

**GET   /post/:id**$~~~~~~~~~~~~~~~~~~~~~~~$: it is used to get post with a particular id





