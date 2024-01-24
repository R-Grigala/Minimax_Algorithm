import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection string (replace with your MongoDB connection string)
const mongoURI = "mongodb+srv://Grigala:Grigala27@ofdigital.hd5ebsz.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

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

app.post("/signup", async (req, res) => {
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

    // Generate a JWT token
    const token = jwt.sign({ userId, username }, "your_secret_key", { expiresIn: "1h" });

    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add login functionality if needed
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in MongoDB
    const user = await userCollection.findOne({ username });

    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
      // Generate a new JWT token for the user
      const token = jwt.sign({ userId: user.userId, username: user.username }, "your_secret_key", { expiresIn: "1h" });
      res.json({
        success: true, 
        userId: user.userId, 
        token, 
        lastName: user.lastName,
        firstName: user.firstName,
        username: user.username
      });

    } else {
      res.json({ success: false, error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
