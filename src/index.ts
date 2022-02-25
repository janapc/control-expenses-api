import "dotenv/config";
import "reflect-metadata";
import express from "express";

import connection from "./database/connection";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await connection();

  const router = (await import("./routes")).default;
  app.use(router);

  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
})();
