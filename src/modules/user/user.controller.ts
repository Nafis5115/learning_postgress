import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  //   const { name, email, password } = req.body;
  try {
    const result = await userService.createUserIntoDB(req.body);
    res.send({
      data: result.rows[0],
    });
  } catch (error: any) {
    res.send({
      error: error.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsersFromDB();
    res.send(users.rows);
  } catch (error: any) {
    res.send({
      error: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  //   const { name, email, password } = req.body;
  const result = await userService.updateUserIntoDB(req.body, id);
  if (result.rows.length === 0) {
    return res.status(201).send({
      message: "User not found",
    });
  }
  res.status(201).send({
    data: result,
  });
};
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.deleteUserFromDB(id);

  if (result.rows.length === 0) {
    return res.status(201).send({
      message: "User not found",
    });
  }
  res.status(201).send({
    data: result,
  });
};

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
