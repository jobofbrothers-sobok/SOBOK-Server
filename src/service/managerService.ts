import { ManagerCreateDTO } from "./../interfaces/user/managerCreateDTO";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";

const prisma = new PrismaClient();

// 매니저 생성
const managerSignup = async (managerCreateDTO: ManagerCreateDTO) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10); // 매우 작은 임의의 랜덤 텍스트 salt
  const password = await bcrypt.hash(managerCreateDTO.password, salt); // 위에서 랜덤으로 생성한 salt를 이용해 암호화
  const data = await prisma.manager.create({
    data: {
      loginId: managerCreateDTO.loginId,
      password,
    },
  });

  return data;
};

// 매니저 로그인
const managerSignIn = async (userSignInDTO: UserSignInDTO) => {
  try {
    const user = await prisma.manager.findFirst({
      where: {
        loginId: userSignInDTO.loginId,
      },
    });
    if (!user) return null;
    // bcrypt가 DB에 저장된 기존 password와 넘겨 받은 password를 대조하고
    // match false시 401을 리턴
    const isMatch = await bcrypt.compare(userSignInDTO.password, user.password);
    if (!isMatch) return sc.UNAUTHORIZED;

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
      authorized: true,
    },
  });
  return data.id;
};

const managerService = {
  managerSignup,
  managerSignIn,
  grantOwnerSignUp,
};

export default managerService;
