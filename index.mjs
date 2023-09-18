import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import path from "path";
const __dirname = path.resolve();
import OpenAI from "openai";
import "dotenv/config.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const mongoURL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ykj1f2q.mongodb.net/Products`;
const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ykj1f2q.mongodb.net`;
const client = new MongoClient(mongodbURI);
const database = client.db("facebook");
const postCollection = database.collection("posts");

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db();
    console.log("Connected to MongoDB");

    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors([
    "http://localhost:3000",
    "127.0.0.1",
    "https://ewrer234234.appspot.app.com",
  ])
);

app.get("/api/v1/posts", async (req, res) => {
  const cursor = postCollection
    .find({})
    .sort({ _id: -1 })
    .project({ plot_embedding: 0 });

  try {
    const allPosts = await cursor.toArray();
    res.send(allPosts);
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: "failed to get posts, please try later" });
  }
});

app.get("/api/v1/search", async (req, res) => {
  const queryText = req.query.q;
  // console.log("queryText", queryText);

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: queryText,
  });
  // console.log("🚀 ~ file: index.mjs:70 ~ app.get ~ response:", response)
  const vector = response?.data[0]?.embedding;
  // console.log("vector: ", vector);
  // [ 0.0023063174, -0.009358601, 0.01578391, ... , 0.01678391, ]

  const documents = await postCollection
    .aggregate([
      {
        $search: {
          index: "default",
          knnBeta: {
            vector: vector,
            path: "plot_embedding",
            k: 2147483647,
          },
          scoreDetails: true,
        },
      },
      {
        $project: {
          plot_embedding: 0,
          score: { $meta: "searchScore" },
          scoreDetails: { $meta: "searchScoreDetails" },
        },
      },
    ])
    .toArray();
  // console.log("documents", documents);
  res.send(documents);
});

app.post("/api/v1/post", async (req, res) => {
  try {
    const doc = {
      text: req?.body?.text,
      // $currentDate: {
      //   createdOn: true,
      // },
    };

    const result = await postCollection.insertOne(doc);
    console.log("result: ", result);
    res.send({
      message: "post created successfully",
    });
  } catch (error) {
    console.log("error: ", error);
    res
      .status(500)
      .send({ message: "Failed to create post, please try later" });
  }
});

app.put("/api/v1/post/:id", async (req, res) => {
  // console.log("🚀 ~ file: index.mjs:125 ~ app.put ~ req.params.id:", req.params.id)
  if (!ObjectId.isValid(req.params.id)) {
    res.status(403).send({ message: "incorrect product id" });
    return;
  }

  let post = {};

  if (req.body.text) post.text = req.body.text;

  try {
    const updateResponse = await postCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: post }
    );

    console.log("Post updated: ", updateResponse);

    res.send({
      message: "post updated successfully",
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .send({ message: "failed to update post, please try later" });
  }
});

app.delete("/api/v1/post/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(403).send({ message: "incorrect product id" });
    return;
  }

  try {
    const deleteResponse = await postCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    console.log("Post deleted: ", deleteResponse);

    res.send({
      message: "post deleted successfully",
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .send({ message: "failed to delete post, please try later" });
  }
});

//  baseurl/filename.txt
app.get(express.static(path.join(__dirname, "./mongodb-crud/out")));
app.use("/", express.static(path.join(__dirname, "./mongodb-crud/out")));

// /Users/malik/Desktop/_CLASS/SMIT-chatbot-b3/04. nodejs/2. crud operation
app.use("/static", express.static(path.join(__dirname, "static")));

app.use((req, res) => {
  res.status(404).send("not found");
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
