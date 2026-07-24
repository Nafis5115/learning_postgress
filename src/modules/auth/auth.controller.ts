import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    res.send({
      data: result,
    });
  } catch (error: any) {
    res.send({
      error: error.message,
    });
  }
};

export const authController = {
  loginUser,
};
