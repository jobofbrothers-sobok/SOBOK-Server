import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import { CustomerCreateDTO } from "../interfaces/user/customerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";

const prisma = new PrismaClient();

// 고객 유저 생성
const createCustomer = async (customerCreateDTO: CustomerCreateDTO) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10); // 매우 작은 임의의 랜덤 텍스트 salt
  const password = await bcrypt.hash(customerCreateDTO.password, salt); // 위에서 랜덤을 생성한 salt를 이용해 암호화
  const data = await prisma.customer.create({
    data: {
      loginId: customerCreateDTO.loginId,
      password,
      name: customerCreateDTO.name,
      email: customerCreateDTO.email,
      phone: customerCreateDTO.phone,
      termsAgree: customerCreateDTO.termsAgree,
      marketingAgree: customerCreateDTO.marketingAgree,
    },
  });

  return data;
};

// 고객 유저 로그인
const customerSignIn = async (userSignInDTO: UserSignInDTO) => {
  try {
    const user = await prisma.customer.findFirst({
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

// 고객 유저 회원탈퇴
const customerDelete = async (id: number) => {
  const data = await prisma.customer.delete({
    where: {
      id: id,
    },
  });
  return data.id;
};
const customerService = {
  createCustomer,
  customerSignIn,
  customerDelete,
};

export default customerService;
