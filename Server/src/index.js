import { connectToDb } from "./config/mongoDB.js";
import app from "./app.js";
import env from "./utlis/validateEnv.js"

const port = env.PORT || 6000;

if (!port || !env.MONGODB_URL) {
  throw new Error(
    "Plese make sure the env file is in place and populated with a port number"
  );
}

connectToDb()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server is connected to port:${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to Server");
    }
  })
  .catch(() => {
    console.log("Invalid database connection");
  });
