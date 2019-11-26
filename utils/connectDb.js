import mongoose from "mongoose";
const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // Use existing db connection
    console.log("Using existing connection");
    return;
  }
  // Use new database connection
  const db = await mongoose.connect(process.env.MONGO_SRV, {
    // remove warnings specific to mongoose
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("DB Connected");
  // Connect Mongo Db to a serverless application
  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
