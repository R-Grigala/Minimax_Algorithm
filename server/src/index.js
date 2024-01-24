import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();

app.use(cors());
app.use(express.json());

// Use environment variables for sensitive information
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://Grigala:Grigala27@ofdigital.hd5ebsz.mongodb.net/?retryWrites=true&w=majority";
const jwtSecretKey = process.env.JWT_SECRET_KEY || "your_secret_key";

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
    const token = jwt.sign({ userId, username }, jwtSecretKey, { expiresIn: "1h" });

    res.json({ token, userId, firstName, lastName, username });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
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
      const token = jwt.sign({ userId: user.userId, username: user.username }, jwtSecretKey, { expiresIn: "1h" });
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
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
