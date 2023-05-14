import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import { OwnerCreateDTO } from "../interfaces/user/ownerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";

const prisma = new PrismaClient();

// 점주 유저 생성
const createOwner = async (ownerCreateDTO: OwnerCreateDTO) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10); // 매우 작은 임의의 랜덤 텍스트 salt
  const password = await bcrypt.hash(ownerCreateDTO.password, salt); // 위에서 랜덤을 생성한 salt를 이용해 암호화
  const data = await prisma.store_Owner.create({
    data: {
      loginId: ownerCreateDTO.loginId,
      password,
      store: ownerCreateDTO.store,
      director: ownerCreateDTO.director,
      phone: ownerCreateDTO.phone,
      email: ownerCreateDTO.email,
      address: ownerCreateDTO.address,
      detailAddress: ownerCreateDTO.detailAddress,
      licenseNumber: ownerCreateDTO.licenseNumber,
      licenseImage: ownerCreateDTO.licenseImage,
      authorized: ownerCreateDTO.authorized,
      termsAgree: ownerCreateDTO.termsAgree,
      marketingAgree: ownerCreateDTO.marketingAgree,
    },
  });

  return data;
};

// 점주 유저 로그인
const ownerSignIn = async (userSignInDTO: UserSignInDTO) => {
  try {
    const user = await prisma.store_Owner.findFirst({
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

const ownerService = {
  createOwner,
  ownerSignIn,
};

export default ownerService;
