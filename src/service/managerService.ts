import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";

const prisma = new PrismaClient();

// 매니저 로그인
const managerSignIn = async (userSignInDTO: UserSignInDTO) => {
  try {
    const user = await prisma.manager.findFirst({
      where: {
        loginId: userSignInDTO.loginId,
      },
    });
    if (!user) return null;

    return user.id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const managerService = {
  managerSignIn,
};

export default managerService;
