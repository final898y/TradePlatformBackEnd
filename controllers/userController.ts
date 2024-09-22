import { Request, Response } from "express";
import * as UserService from "../Services/userService"

const getAllUsers = (req: Request, res: Response): void => {
  res.send("Return all users");
};

const GetUserDetail = async (req: Request, res: Response): Promise<void> => {
  const UID = req.query.uid as string;
  try {
    const results = await UserService.GetUserDetail(UID);

    if ((results as any[]).length === 0) {
      res.status(404).send("User not found");
      return;
    }
    res.json(results[0]);
  } catch (error) {
    res.status(500).send("Error fetching user");
    console.error(error);
  }
};


export {
  getAllUsers,
  GetUserDetail,
};