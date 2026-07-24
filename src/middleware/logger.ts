import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log("Middleware");
  fs.appendFile(
    "logger.txt",
    `Method - ${req.method} -- Time - ${Date.now()} -- URL - ${req.url}`,
    (err) => {
      console.log(err);
    },
  );

  next();
};

export default logger;
