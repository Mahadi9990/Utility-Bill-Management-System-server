const express =require("express")
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = 3000;



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://shafayat9999:ME3wIItyhhLlWn10@cluster0.37mu4gc.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// app.use(cors());
// app.use(express.json());

// const uri =
//   "mongodb+srv://server-2:UjBUWVGjhGcWQQ3m@cluster0.rlr9txn.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     const database = client.db("sample_mflix");
//     const movies = database.collection("movies");
//     const products = database.collection("products");

//     app.get("/", (req, res) => {
//       res.send("Hello World!");
//     });




//     // client not make

//     app.get("/products", async (req, res) => {
//       const cursor = products.find().sort({ price_min: -1, title: 1 , category: 1  }).skip(1).limit(5);
//       const allValues = await cursor.toArray();
//       res.send(allValues);
//     });
//     app.post("/productPost", async (req, res) => {
//       const newUser = req.body;
//       const result = await products.insertOne(newUser);
//       res.send(result);
//     });

// // client not make

//     app.get("/users", async (req, res) => {
//       const cursor = movies.find();
//       const allValues = await cursor.toArray();
//       res.send(allValues);
//     });
//     app.post("/usersPost", async (req, res) => {
//       const newUser = req.body;
//       const result = await movies.insertOne(newUser);
//       res.send(result);
//     });
//     app.get("/user/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await movies.findOne(query);
//       res.send(result);
//     });
//     app.delete("/user/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await movies.deleteOne(query);
//       res.send(result);
//     });
//     app.patch("/userUpdata/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const update = req.body;
//       const updatUser = {
//         $set:{
//           name:update.name,
//           email:update.email
//         }
//       }
//       const options = {};
//       const result = await movies.updateOne(query, updatUser, options);
//       res.send(result);
//     });
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
