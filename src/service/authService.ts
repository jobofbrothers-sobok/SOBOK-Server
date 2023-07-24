// import { session } from "express-session";
import { CreateDeliveryRequestDTO } from "./../interfaces/delivery/createDeliveryRequestDTO";
import { PrismaClient, Stamp, Store_Owner } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import { CustomerCreateDTO } from "../interfaces/user/customerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import { CustomerUpdateDTO } from "./../interfaces/user/customerUpdateDTO";
import { OwnerCreateDTO } from "../interfaces/user/ownerCreateDTO";
import { OwnerUpdateDTO } from "../interfaces/user/ownerUpdateDTO";
import { Request, Response } from "express";
import axios from "axios";

const prisma = new PrismaClient();

// 고객 유저 회원가입
const createCustomer = async (customerCreateDTO: CustomerCreateDTO) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10); // 매우 작은 임의의 랜덤 텍스트 salt
  const password = await bcrypt.hash(customerCreateDTO.password, salt); // 위에서 랜덤으로 생성한 salt를 이용해 암호화
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

// 점주 유저 회원가입 1
const createOwner = async (ownerCreateDTO: OwnerCreateDTO, path: string) => {
  // // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  // const salt = await bcrypt.genSalt(10); // 매우 작은 임의의 랜덤 텍스트 salt
  // const password = await bcrypt.hash(ownerCreateDTO.password, salt); // 위에서 랜덤을 생성한 salt를 이용해 암호화
  const data = await prisma.store_Owner.create({
    data: {
      loginId: ownerCreateDTO.loginId,
      // password,
      // store: ownerCreateDTO.store,
      // director: ownerCreateDTO.director,
      // phone: ownerCreateDTO.phone,
      // email: ownerCreateDTO.email,
      // address: ownerCreateDTO.address,
      // detailAddress: ownerCreateDTO.detailAddress,
      // licenseNumber: ownerCreateDTO.licenseNumber,
      licenseImage: path,
      // termsAgree: ownerCreateDTO.termsAgree,
      // marketingAgree: ownerCreateDTO.marketingAgree,
    },
  });
  const result = {
    userId: data.id,
    loginId: data.loginId,
    licenseImage: data.licenseImage,
  };
  return result;
};

// 점주 유저 회원가입 2
const patchOwner = async (ownerCreateDTO: OwnerCreateDTO) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10); // 매우 작은 임의의 랜덤 텍스트 salt
  const password = await bcrypt.hash(ownerCreateDTO.password, salt); // 위에서 랜덤을 생성한 salt를 이용해 암호화
  const data = await prisma.store_Owner.update({
    where: {
      loginId: ownerCreateDTO.loginId,
    },
    data: {
      password: password,
      store: ownerCreateDTO.store,
      director: ownerCreateDTO.director,
      phone: ownerCreateDTO.phone,
      email: ownerCreateDTO.email,
      address: ownerCreateDTO.address,
      detailAddress: ownerCreateDTO.detailAddress,
      licenseNumber: ownerCreateDTO.licenseNumber,
      termsAgree: ownerCreateDTO.termsAgree,
      marketingAgree: ownerCreateDTO.marketingAgree,
    },
  });

  return data;
};

// 로그인아이디 중복확인
const checkLoginId = async (sort: string, loginId: string) => {
  switch (sort) {
    case "customer":
      const customer = await prisma.customer.findUnique({
        where: {
          loginId: loginId,
        },
      });
      if (customer !== null) {
        return {
          idAlreadyExist: true,
          foundCustomerId: customer.id,
          foundCustomerLoginId: customer.loginId,
          fondCustomerName: customer.name,
        };
      } else {
        return {
          LoginIdAlreadyExist: false,
        };
      }
    case "owner":
      const owner = await prisma.store_Owner.findUnique({
        where: {
          loginId: loginId,
        },
      });
      if (owner !== null) {
        return {
          idAlreadyExist: true,
          foundOwnerId: owner.id,
          foundOwnerLoginId: owner.loginId,
          fondOwnerName: owner.director,
        };
      } else {
        return {
          LoginIdAlreadyExist: false,
        };
      }
  }
};

// 고객 유저 로그인
const customerSignIn = async (userSignInDTO: UserSignInDTO) => {
  try {
    const user = await prisma.customer.findUnique({
      where: {
        loginId: userSignInDTO.loginId,
      },
    });
    if (!user) return null;

    // bcrypt가 DB에 저장된 기존 password와 넘겨 받은 password를 대조하고
    // match false시 401을 리턴
    const isMatch = await bcrypt.compare(userSignInDTO.password, user.password);
    if (!isMatch) return sc.UNAUTHORIZED;

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 점주 유저 로그인

/* 스탬프 사용 신청 전이면 
stampAuthorized: false
pending: false

신청 후 승인 기다리는중이면
stampAuthorized: false
pending: true

신청 후 승인된 상태면
stampAuthorized: true
pending: false
*/

const ownerSignIn = async (userSignInDTO: UserSignInDTO) => {
  try {
    const user: Store_Owner | null | any = await prisma.store_Owner.findUnique({
      where: {
        loginId: userSignInDTO.loginId,
      },
    });
    if (!user) return null;

    // bcrypt가 DB에 저장된 기존 password와 넘겨 받은 password를 대조하고
    // match false시 401을 리턴
    const isMatch = await bcrypt.compare(
      userSignInDTO.password,
      user.password as string
    );
    if (!isMatch) return sc.UNAUTHORIZED;
    const stampRequest = await prisma.stamp_Request.findUnique({
      where: {
        ownerId: user.id,
      },
    });
    // 스탬프 사용 신청 전일 경우
    if (user.stampAuthorized === false && !stampRequest) {
      user.pending = false;
    }
    // 스탬프 사용 신청 후 승인 대기중일 경우
    if (user.stampAuthorized === false && stampRequest !== null) {
      user.pending = true;
    }
    // 스탬프 사용 신청 후 승인된 경우
    if (user.stampAuthorized === true) {
      user.pending = false;
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 고객 유저 회원정보 수정
const customerUpdate = async (
  id: number,
  customerUpdateDTO: CustomerUpdateDTO,
  path: string
) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(customerUpdateDTO.password, salt); // 위에서 랜덤으로 생성한 salt를 이용해 암호화
  const data = await prisma.customer.update({
    where: {
      id,
    },
    data: {
      password: password,
      name: customerUpdateDTO.name,
      email: customerUpdateDTO.email,
      phone: customerUpdateDTO.phone,
      image: path,
    },
  });
  return data.id;
};

// 점주 유저 회원정보 수정
const ownerUpdate = async (
  id: number,
  ownerUpdateDTO: OwnerUpdateDTO,
  path1: string,
  path2: string
) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(ownerUpdateDTO.password, salt); // 위에서 랜덤으로 생성한 salt를 이용해 암호화
  const data = await prisma.store_Owner.update({
    where: {
      id,
    },
    data: {
      password,
      director: ownerUpdateDTO.director,
      phone: ownerUpdateDTO.phone,
      email: ownerUpdateDTO.email,
      address: ownerUpdateDTO.address,
      detailAddress: ownerUpdateDTO.detailAddress,
      licenseNumber: ownerUpdateDTO.licenseNumber,
      licenseImage: path1,
      profileImage: path2,
    },
  });

  //* 담당자 정보 수정 시 매장 주소를 수정할 경우 -> 매장 테이블의 x, y 필드 값 변경
  // 점주 유저의 매장 주소(도로명 주소)
  const storeLocation = data.address;

  // 네이버 지도 API를 통해 x, y 좌표 조회
  const geocodeResult = await axios.get(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${storeLocation}`,
    {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_GEOCODING_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": process.env.NAVER_GEOCODING_CLIENT_SECRET,
      },
    }
  );
  const x = geocodeResult.data.addresses[0].x;
  const y = geocodeResult.data.addresses[0].y;

  // 점주 유저의 매장 x, y 필드 값을 수정
  const result = await prisma.store.update({
    where: {
      ownerId: id,
    },
    data: {
      x: x,
      y: y,
    },
  });
  // console.log(data);
  return data.id;
};

// 고객 유저 회원정보 찾기
const findCustomerByEmail = async (email: string) => {
  const data = await prisma.customer.findFirst({
    where: {
      email: email,
    },
  });
  return data;
};

// 고객 유저 비밀번호 재설정
const resetCustomerPw = async (id: number, token: string) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10);
  const resetPassword = await bcrypt.hash(token, salt); // 위에서 랜덤으로 생성한 salt를 이용해 암호화
  const data = await prisma.customer.update({
    where: {
      id: id,
    },
    data: {
      password: resetPassword,
    },
  });
  const result = {
    customerId: data.id,
    loginId: data.loginId,
  };
  return result;
};

// 점주 유저 회원정보 찾기
const findOwnerByEmail = async (email: string) => {
  const data = await prisma.store_Owner.findUnique({
    where: {
      email: email,
    },
  });
  return data;
};

// 점주 유저 비밀번호 재설정
const resetOwnerPw = async (id: number, token: string) => {
  // 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10);
  const resetPassword = await bcrypt.hash(token, salt); // 위에서 랜덤으로 생성한 salt를 이용해 암호화
  const data = await prisma.store_Owner.update({
    where: {
      id: id,
    },
    data: {
      password: resetPassword,
    },
  });
  const result = {
    ownerId: data.id,
    loginId: data.loginId,
  };
  return result;
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

// 점주 유저 회원탈퇴
const ownerDelete = async (id: number) => {
  const data = await prisma.store_Owner.delete({
    where: {
      id: id,
    },
  });
  return data.id;
};

const authService = {
  createCustomer,
  createOwner,
  patchOwner,
  checkLoginId,
  customerSignIn,
  ownerSignIn,
  customerUpdate,
  ownerUpdate,
  findCustomerByEmail,
  resetCustomerPw,
  findOwnerByEmail,
  resetOwnerPw,
  customerDelete,
  ownerDelete,
};

export default authService;
