"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const db_1 = require("../db");
const user_1 = require("../models/user");
const post_1 = require("../models/post");
const allowedPasswords = ["123", "124", "125", "126"];
// RANDOM PASSWORD
const getRandomPassword = () => allowedPasswords[Math.floor(Math.random() * allowedPasswords.length)];
// RANDOM USER
function createRandomUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = user_1.User.create({
            username: faker_1.faker.internet.userName(),
            password: getRandomPassword(),
        });
        return newUser;
    });
}
// RANDOM USER ID , TO ASSIGN TO POSTS
const getRandomUserID = (users) => users[Math.floor(Math.random() * users.length)]._id;
// RANDOM POSTS
function createRandomPosts(users) {
    const newPost = post_1.Post.create({
        content: faker_1.faker.lorem.paragraph({ min: 2, max: 3 }),
        author: getRandomUserID(users),
    });
    return newPost;
}
// GET RANDOM FOLLOWERS
function getRandomFollowers(user, total, users) {
    let randomFollowers = [];
    console.log("user = ", user);
    for (let i = 0; i <= total; i++) {
        const index = Math.floor(Math.random() * users.length);
        if (users[index]._id === user ||
            randomFollowers.includes(users[index]._id))
            continue;
        randomFollowers.push(users[index]._id);
    }
    return randomFollowers;
}
// ASSIGN RANDOM FOLLOWERS
function addRandomFollowers(users) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let user of users) {
            const total = Math.floor(Math.random() * users.length) + 2;
            const followers = getRandomFollowers(user._id, total, users);
            yield user.updateOne({ $set: { followers } });
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_1.User.deleteMany();
        yield post_1.Post.deleteMany();
        // create 5 random users
        const userPromise = faker_1.faker.helpers.multiple(createRandomUser, { count: 5 });
        const users = yield Promise.all(userPromise);
        console.log("User successfully created.");
        // create 15 random posts
        const postsPromise = faker_1.faker.helpers.multiple(() => createRandomPosts(users), {
            count: 15,
        });
        yield Promise.all(postsPromise);
        console.log("Post successfully created.");
        yield addRandomFollowers(users);
        console.log("Followers added");
    });
}
(0, db_1.connectDb)()
    .then(() => {
    console.log("Connected to database");
    main();
})
    .catch(() => console.log("Error connecting to databse."));
