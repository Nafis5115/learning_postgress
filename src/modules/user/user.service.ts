import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *
        `,
    [name, email, hashedPassword],
  );
  delete result.rows[0].password;
  return result;
};

const updateUserIntoDB = async (payload: IUser, id: any) => {
  const { name, email, password } = payload;
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
  return result;
};

const deleteUserFromDB = async (id: any) => {
  const result = await pool.query(
    `
    DELETE FROM users WHERE id = $1
    RETURNING *
    `,
    [id],
  );
  return result;
};

const getAllUsersFromDB = async () => {
  const users = await pool.query(`SELECT * FROM users`);
  return users;
};

export const userService = {
  createUserIntoDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getAllUsersFromDB,
};
