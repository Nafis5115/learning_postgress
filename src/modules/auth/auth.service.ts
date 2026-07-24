import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );
  if (userData.rowCount === 0) {
    throw new Error("User not exists");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Password not matched");
  }

  //Generate Token
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  const accessToken = jwt.sign(jwtPayload, config.SECRET as string, {
    expiresIn: "1D",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
};
