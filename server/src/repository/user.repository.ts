import { QueryFilter } from "mongoose";
import { UserModel, IUser } from "../model/user.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;

  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;

  //this is the get all users
  getAllUsers(
    page: number,
    size: number,
    search?: string
  ): Promise<{ users: IUser[]; total: number }>;

  updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async getAllUsers(
    page: number,
    size: number,
    search?: string
  ): Promise<{ users: IUser[]; total: number }> {
    const filter: QueryFilter<IUser> = {};

    if (search && search.trim()) {
      const s = search.trim();
      filter.$or = [
        { username: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { fullName: { $regex: s, $options: "i" } },
        { phoneNumber: { $regex: s, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select("-password") // 
        .sort({ createdAt: -1, _id: -1 }) 
        .skip((page - 1) * size)
        .limit(size),
      UserModel.countDocuments(filter),
    ]);

    return { users, total };
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result ? true : false;
  }
}