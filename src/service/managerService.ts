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
        password: userSignInDTO.password,
      },
    });
    if (!user) return null;

    return user.id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 점주 회원가입 승인
const grantOwnerSignUp = async (id: number) => {
  const data = await prisma.store_Owner.update({
    where: {
      id: id,
    },
    data: {
      isGrant: true,
    },
  });
  return data.id;
};

const managerService = {
  managerSignIn,
  grantOwnerSignUp,
};

export default managerService;
