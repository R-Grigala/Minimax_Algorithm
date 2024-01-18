import express from 'express';
import bcrypt from 'bcrypt';
import {MongoClient, ServerApiVersion} from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";

const app = express();
const port = 3001;

// MongoDB connection string (replace with your MongoDB connection string)
const mongoURI = "mongodb+srv://Grigala:Grigala27@ofdigital.hd5ebsz.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware
app.use(express.json());

// MongoDB connection and user collection
let userCollection;

async function connectToMongoDB() {
  try {
    await client.connect();
    userCollection = client.db("your_database").collection("users");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

// Sign up endpoint
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into MongoDB
    await userCollection.insertOne({
      userId,
      firstName,
      lastName,
      username,
      hashedPassword,
    });

    res.json({ userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in MongoDB
    const user = await userCollection.findOne({ username });

    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
      res.json({ success: true, userId: user.userId });
    } else {
      res.json({ success: false, error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
