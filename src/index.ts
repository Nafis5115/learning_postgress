import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";
const app: Application = express();
const port = 3001;
const pool = new Pool({
  connectionString: config.connection_string,
});
const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    console.log("Database connected");
  } catch (error) {}
};
initDB();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query(
      `
        INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *
        `,
      [name, email, password],
    );
    res.send({
      data: result.rows[0],
    });
  } catch (error: any) {
    res.send({
      error: error.message,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await pool.query(`SELECT * FROM users`);
    res.send(users.rows);
  } catch (error: any) {
    res.send({
      error: error.message,
    });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const result = await pool.query(
    `
    UPDATE users
    SET name = COALESCE($1, name), 
    email = COALESCE ($2, email), 
    password = COALESCE ($3, password)
    WHERE id = $4
    RETURNING *
    `,
    [name, email, password, id],
  );
  if (result.rows.length === 0) {
    return res.status(201).send({
      message: "User not found",
    });
  }
  res.status(201).send({
    data: result,
  });
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query(
    `
    DELETE FROM users WHERE id = $1
    RETURNING *
    `,
    [id],
  );
  if (result.rows.length === 0) {
    return res.status(201).send({
      message: "User not found",
    });
  }
  res.status(201).send({
    data: result,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
