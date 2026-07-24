import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.CONNECTION_STRING as string,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
};

export default config;
