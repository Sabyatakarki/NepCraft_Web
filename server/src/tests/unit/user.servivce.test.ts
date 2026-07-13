import { UserService } from "../../services/user.service";
import { UserRepository } from "../../repository/user.repository";
import { sendEmail } from "../../config/email";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpError } from "../../errors/http-error";

jest.mock("../../repository/user.repository");
jest.mock("../../config/email", () => ({
  sendEmail: jest.fn(),
}));

describe("UserService", () => {
  let userService: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepo = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
  });

  // ===============================
  // 1. Create User Success
  // ===============================
  it("should create a new user", async () => {
    mockRepo.getUserByEmail.mockResolvedValue(null);
    mockRepo.getUserByUsername.mockResolvedValue(null);

    (bcryptjs.hash as jest.Mock).mockResolvedValue("hashedpassword");

    mockRepo.createUser.mockResolvedValue({
      _id: "1",
      fullName: "Sabbu",
      email: "sabbu@test.com",
    } as any);

    const result = await userService.createUser({
      fullName: "Sabbu",
      email: "sabbu@test.com",
      password: "password",
      confirmPassword: "password",
      phoneNumber: "9800000000",
      
    });

    expect(result.email).toBe("sabbu@test.com");
    expect(mockRepo.createUser).toHaveBeenCalled();
  });

  // ===============================
  // 2. Duplicate Email
  // ===============================
  it("should throw if email already exists", async () => {
    mockRepo.getUserByEmail.mockResolvedValue({
      email: "sabbu@test.com",
    } as any);

    await expect(
      userService.createUser({
        fullName: "Sabbu",
        email: "sabbu@test.com",
        password: "password",
        confirmPassword: "password",
        phoneNumber: "9800000000",
       
      })
    ).rejects.toThrow(HttpError);
  });

  // ===============================
  // 3. Login Success
  // ===============================
  it("should login successfully", async () => {
    const fakeUser = {
      _id: "1",
      email: "sabbu@test.com",
      password: "hashedpassword",
      role: "customer",
      fullName: "Sabbu",
      phoneNumber: "9800000000",
      toObject() {
        return this;
      },
    };

    mockRepo.getUserByEmail.mockResolvedValue(fakeUser as any);

    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fake-token");

    const result = await userService.loginUser({
      email: "sabbu@test.com",
      password: "password",
    });

    expect(result.token).toBe("fake-token");
    expect(result.user.email).toBe("sabbu@test.com");
  });

  // ===============================
  // 4. Invalid Password
  // ===============================
  it("should throw when password is incorrect", async () => {
    mockRepo.getUserByEmail.mockResolvedValue({
      password: "hashedpassword",
    } as any);

    (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      userService.loginUser({
        email: "sabbu@test.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow(HttpError);
  });

  // ===============================
  // 5. Get User By ID
  // ===============================
  it("should return user by id", async () => {
    mockRepo.getUserById.mockResolvedValue({
      _id: "1",
      fullName: "Sabbu",
    } as any);

    const result = await userService.getUserById("1");

    expect(result.fullName).toBe("Sabbu");
  });

  // ===============================
  // 6. Update User
  // ===============================
  it("should update user", async () => {
    mockRepo.getUserById.mockResolvedValue({
      _id: "1",
      email: "old@test.com",
      fullName: "Old Name",
    } as any);

    mockRepo.getUserByEmail.mockResolvedValue(null);
    mockRepo.getUserByUsername.mockResolvedValue(null);

    mockRepo.updateUser.mockResolvedValue({
      _id: "1",
      fullName: "New Name",
    } as any);

    const result = await userService.updateUser("1", {
      fullName: "New Name",
    });

    
  });

  // ===============================
  // 7. Reset Password
  // ===============================
  it("should reset password successfully", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      id: "1",
    });

    (bcryptjs.hash as jest.Mock).mockResolvedValue("hashedpassword");

    mockRepo.updateUser.mockResolvedValue({
      _id: "1",
    } as any);

    const result = await userService.resetPassword(
      "token123",
      "newpassword"
    );

    expect(result._id).toBe("1");
  });
});