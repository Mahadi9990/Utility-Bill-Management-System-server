const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;
const admin = require("firebase-admin");

const serviceAccount = require("./server-2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(express.json());
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  try {
    // If using Firebase Admin SDK to verify JWT:
    const userInfo = await admin.auth().verifyIdToken(token);
    console.log("valiad Token", userInfo);
    req.token_email = userInfo.email;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token verification failed" });
  }
};

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://shafayat9999:ME3wIItyhhLlWn10@cluster0.37mu4gc.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const dataBase = client.db("Utility_Bill");
    const userCollection = dataBase.collection("users");
    const allBills = dataBase.collection("allBills");
    const catagoryMenu = dataBase.collection("catagorys");
    const payBills = dataBase.collection("PayBills");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const allUser = await cursor.toArray();
      res.send(allUser);
    });
    app.get("/userBillsRecords", verifyToken,async (req, res) => {
      try {
        const email = req.query.email;
        const query = {};
        if (email) {
          if (email !== req.token_email) {
            return res.status(403).json({ message: "Access denied" });
          }
          query.payUserEmail = email;
        }
        const cursor = payBills.find(query);
        const userBillsRecodes = await cursor.toArray();
        res.send(userBillsRecodes);
      } catch (error) {
        console.error("Error fetching user bills:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
    app.get("/billsRecodes/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { payUserId: id };
        const cursor = payBills.find(query);
        const billsRecodes = await cursor.toArray();
        res.send(billsRecodes);
      } catch (error) {
        console.error("Error fetching user bills:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
    app.get("/sixBills", async (req, res) => {
      const cursor = allBills.find().sort({ date: -1 }).limit(6);
      const sixBills = await cursor.toArray();
      res.send(sixBills);
    });
    app.get("/bills", async (req, res) => {
      const cursor = allBills.find();
      const bills = await cursor.toArray();
      res.send(bills);
    });
    app.get("/bills/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const bill = await allBills.findOne({ _id: new ObjectId(id) });

        if (!bill) {
          return res.status(404).send({ message: "Bill not found" });
        }

        res.send(bill);
      } catch (error) {
        console.error("Error fetching bill:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
    app.get("/catagoryMenu", async (req, res) => {
      const cursor = catagoryMenu.find().sort({ _id: 1 });
      const catagorys = await cursor.toArray();
      res.send(catagorys);
    });
    app.get("/catagorys/:menuName", async (req, res) => {
      const menuName = req.params.menuName;
      const query = { category: menuName };
      const cursor = allBills.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });

    app.post("/usersPost", verifyToken, async (req, res) => {
      try {
        const newUser = req.body;
        console.log(req.headers);
        const { email } = newUser;
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          return res.status(200).send({
            message: "User already exists",
            user: existingUser,
          });
        }

        const result = await userCollection.insertOne(newUser);
        res.status(201).send({
          message: "User created successfully",
          userId: result.insertedId,
        });
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
    app.post("/billsPost", async (req, res) => {
      try {
        const newPost = req.body;
        const result = await allBills.insertOne(newPost);
        res.status(201).send({
          message: "Bills created successfully",
          userId: result.insertedId,
        });
      } catch (error) {
        console.error("Error inserting Bills:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
    app.post("/billsRecords", async (req, res) => {
      try {
        const newPost = req.body;
        const result = await payBills.insertOne(newPost);
        res.status(201).send({
          message: "Bills created successfully",
          userId: result.insertedId,
        });
      } catch (error) {
        console.error("Error inserting Bills:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
