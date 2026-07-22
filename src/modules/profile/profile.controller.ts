import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createProfileIntoDB(req.body);
    res.send({
      data: result.rows[0],
    });
  } catch (error: any) {
    res.send({
      error: error.message,
    });
  }
};

export const profileController = {
  createProfile,
};
