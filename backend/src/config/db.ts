import mongoose from "mongoose";

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING as string)
  .then(() => console.log("DB CONNECTION SUCCESSFULL"))
  .catch((err) => {
    console.log("DB CONNECTION FAILED", err.message);
  });
