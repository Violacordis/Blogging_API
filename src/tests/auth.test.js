const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const { connectToMongoDB } = require("../db/db_connect");

describe("user signup and login", () => {
  beforeAll(async () => {
    await connectToMongoDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should signup a new user", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/signup")
      .set("Content-Type", "application/json")
      .send({
        firstName: "munachimso",
        lastName: "chikamso",
        email: "muna@gmail.com",
        password: "12345678",
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.firstName).toBe("munachimso");
    expect(response.body.data.user.lastName).toBe("chikamso");
    expect(response.body.data.user.email).toBe("muna@gmail.com");
  }, 120000);

  it("should login a user", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({
        email: "dim@gmail.com",
        password: "12345678",
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });
});
