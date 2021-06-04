const mongoose = require("mongoose");

const dbName = process.env.DB_COLLECTION_NAME;
const dbPass = process.env.DB_COLLECTION_PASSWORD;

const db = `mongodb+srv://userRegistration:${dbPass}@cluster0.fqvvi.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(db, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connection Successfully with mongoDb Atlas`);
  })
  .catch((err) => {
    console.error(err);
  });
