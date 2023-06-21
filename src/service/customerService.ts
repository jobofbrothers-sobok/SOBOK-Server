import { PrismaClient, Stamp } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import { CustomerCreateDTO } from "../interfaces/user/customerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import { CustomerUpdateDTO } from "./../interfaces/user/customerUpdateDTO";
import ownerService from "./ownerService";

const prisma = new PrismaClient();

// 고객 유저 생성
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

// 고객 유저 회원정보 수정
const updateCustomer = async (
  id: number,
  customerUpdateDTO: CustomerUpdateDTO
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
    },
  });
  return data.id;
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

// 고객 유저 이름 조회
const getCustomerName = async (id: number) => {
  const data = await prisma.customer.findUnique({
    where: {
      id: id,
    },
  });
  return data?.name;
};

// 고객 유저 조회
const findCustomerById = async (id: number) => {
  const data = await prisma.customer.findUnique({
    where: {
      id: id,
    },
  });
  return data;
};

// 고객 스탬프 적립
const createStampNumber = async (id: number, randNum: string) => {
  const data = await prisma.stamp.create({
    data: {
      randNum: randNum,
      customerId: id,
    },
  });
  return data;
};

// 고객 스탬프 전체 조회
const getAllStamp = async (sort: string, id: number) => {
  if (sort !== "all") {
    switch (sort) {
      case "hoegi":
        const hoegi = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: "경희대학교 카페 투어",
          },
        });
        return hoegi;
      case "sookmyung":
        const sookmyung = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: "숙대입구 카페 투어",
          },
        });
        return sookmyung;
      case "halloween":
        const halloween = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: "할로윈 특집 카페 투어",
          },
        });
        console.log(halloween);
        return halloween;
      case "xmas":
        const xmas = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: "크리스마스 특집 카페 투어",
          },
        });
        return xmas;
    }
  }

  if (sort === "all") {
    const data = await prisma.stamp.findMany({
      where: {
        customerId: id,
      },
    });
    return data;
  }
};

// 고객 스탬프 투어 참여 매장 조회
const getAllTourStore = async (sort: string) => {
  let tourTitle;
  switch (sort) {
    case "hoegi":
      tourTitle = "경희대학교 카페 투어";
      const hoegiTour = await ownerService.getTourByTourTitle(tourTitle);
      const hoegi = await prisma.store.findMany({
        where: {
          tourId: hoegiTour?.id,
        },
      });
      return hoegi;
    case "sookmyung":
      tourTitle = "숙대입구 카페 투어";
      const sookTour = await ownerService.getTourByTourTitle(tourTitle);
      const sookmyung = await prisma.store.findMany({
        where: {
          tourId: sookTour?.id,
        },
      });
      return sookmyung;
    case "halloween":
      tourTitle = "할로윈 특집 카페 투어";
      const halloweenTour = await ownerService.getTourByTourTitle(tourTitle);
      const halloween = await prisma.store.findMany({
        where: {
          tourId: halloweenTour?.id,
        },
      });
      return halloween;
    case "xmas":
      tourTitle = "크리스마스 특집 카페 투어";
      const xmasTour = await ownerService.getTourByTourTitle(tourTitle);
      const xmas = await prisma.store.findMany({
        where: {
          tourId: xmasTour?.id,
        },
      });
      return xmas;
  }
};

const customerService = {
  createCustomer,
  customerSignIn,
  updateCustomer,
  customerDelete,
  getCustomerName,
  findCustomerById,
  createStampNumber,
  getAllStamp,
  getAllTourStore,
};

export default customerService;
