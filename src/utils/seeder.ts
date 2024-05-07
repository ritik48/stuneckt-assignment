import monongoose, { Document } from "mongoose";
import { faker } from "@faker-js/faker";

import { connectDb } from "../db";
import { User } from "../models/user";
import { Post } from "../models/post";

const allowedPasswords = ["123", "124", "125", "126"];

// RANDOM PASSWORD
const getRandomPassword = () =>
    allowedPasswords[Math.floor(Math.random() * allowedPasswords.length)];

// RANDOM USER
async function createRandomUser() {
    const newUser = User.create({
        username: faker.internet.userName(),
        password: getRandomPassword(),
    });

    return newUser;
}

// RANDOM USER ID , TO ASSIGN TO POSTS
const getRandomUserID = (users: Document[]) =>
    users[Math.floor(Math.random() * users.length)]._id;

// RANDOM POSTS
function createRandomPosts(users: Document[]) {
    const newPost = Post.create({
        content: faker.lorem.paragraph({ min: 2, max: 3 }),
        author: getRandomUserID(users),
    });

    return newPost;
}

// GET RANDOM FOLLOWERS

function getRandomFollowers(user: string, total: number, users: Document[]) {
    let randomFollowers: string[] = [];
    console.log("user = ", user);
    for (let i = 0; i <= total; i++) {
        const index = Math.floor(Math.random() * users.length);

        if (
            users[index]._id === user ||
            randomFollowers.includes(users[index]._id)
        )
            continue;

        randomFollowers.push(users[index]._id);
    }
    return randomFollowers;
}

// ASSIGN RANDOM FOLLOWERS

async function addRandomFollowers(users: Document[]) {
    for (let user of users) {
        const total = Math.floor(Math.random() * users.length) + 2;
        const followers = getRandomFollowers(user._id, total, users);
        await user.updateOne({ $set: { followers } });
    }
}

async function main() {
    await User.deleteMany();
    await Post.deleteMany();

    // create 5 random users
    const userPromise = faker.helpers.multiple(createRandomUser, { count: 5 });
    const users = await Promise.all(userPromise);

    console.log("User successfully created.");

    // create 15 random posts
    const postsPromise = faker.helpers.multiple(
        () => createRandomPosts(users),
        {
            count: 15,
        }
    );
    await Promise.all(postsPromise);

    console.log("Post successfully created.");

    await addRandomFollowers(users);
    console.log("Followers added");
}

connectDb()
    .then(() => {
        console.log("Connected to database");
        main();
    })
    .catch(() => console.log("Error connecting to databse."));
