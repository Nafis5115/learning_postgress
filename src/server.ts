import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = () => {
  initDB();
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });
};

main();
