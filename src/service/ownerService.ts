import { OwnerCreateAlimRequestDTO } from "./../interfaces/user/ownerCreateAlimRequestDTO";
import { CreateStoreProductDTO } from "./../interfaces/store/creatseStoreProductDTO";
import { CreateStoreNoticeDTO } from "./../interfaces/store/createStoreNoticeDTO";
import { CreateStoreInfoDTO } from "./../interfaces/store/createStoreInfoDTO";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import { OwnerCreateDTO } from "../interfaces/user/ownerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import { OwnerUpdateDTO } from "../interfaces/user/ownerUpdateDTO";
import { CreateStoreMenuDTO } from "../interfaces/store/createStoreMenuDTO";
import axios from "axios";

const prisma = new PrismaClient();

// 점주 유저 이름조회
const getOwnerName = async (id: number) => {
  const data = await prisma.store_Owner.findUnique({
    where: {
      id: id,
    },
  });
  return data?.director;
};

// 점주 유저 조회
const findOwnerById = async (id: number) => {
  const data = await prisma.store_Owner.findUnique({
    where: {
      id: id,
    },
  });
  return data;
};

// 점주 매장정보 등록 및 수정
const createStoreInfo = async (
  createStoreInfoDTO: CreateStoreInfoDTO,
  ownerId: number,
  path: string
) => {
  const store = await prisma.store.findUnique({
    where: {
      ownerId: ownerId,
    },
  });
  //* 이미 등록된 매장정보가 있을 경우 - 수정
  if (store !== null) {
    const updatedData = await prisma.store.update({
      where: {
        ownerId: ownerId,
      },
      data: {
        storeName: createStoreInfoDTO.storeName,
        description: createStoreInfoDTO.description,
        officeHour: createStoreInfoDTO.officeHour,
        dayOff: createStoreInfoDTO.dayOff,
        homepage: createStoreInfoDTO.homepage,
        image: path,
        category: createStoreInfoDTO.category.split(","),
      },
    });
    console.log("updated");
    return updatedData;
  } else {
    //* 이미 등록된 매장정보가 없을 경우 - 등록
    // 점주 유저의 매장 주소 조회
    const owner = await prisma.store_Owner.findUnique({
      where: {
        id: ownerId,
      },
    });
    const storeLocation = owner?.address;

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
    console.log(geocodeResult.data);
    const x = geocodeResult.data.addresses[0].x;
    const y = geocodeResult.data.addresses[0].y;

    // request body에 x, y 좌표를 추가하여 매장 레코드 생성
    const data = await prisma.store.create({
      data: {
        storeName: createStoreInfoDTO.storeName,
        description: createStoreInfoDTO.description,
        officeHour: createStoreInfoDTO.officeHour,
        dayOff: createStoreInfoDTO.dayOff,
        homepage: createStoreInfoDTO.homepage,
        image: path,
        category: createStoreInfoDTO.category.split(","),
        ownerId,
        x: x,
        y: y,
      },
    });
    console.log("created");
    return data;
  }
};

// 점주 매장id 부여
const createStoreIdForOwner = async (ownerId: number, storeId: number) => {
  const data = await prisma.store_Owner.update({
    where: {
      id: ownerId,
    },
    data: {
      storeId: storeId,
    },
  });
  return data;
};

// 점주 매장정보 수정
const updateStoreInfo = async (
  storeId: number,
  createStoreInfoDTO: CreateStoreInfoDTO,
  path: string
) => {
  const data = await prisma.store.update({
    where: {
      id: storeId,
    },
    data: {
      storeName: createStoreInfoDTO.storeName,
      description: createStoreInfoDTO.description,
      officeHour: createStoreInfoDTO.officeHour,
      dayOff: createStoreInfoDTO.dayOff,
      homepage: createStoreInfoDTO.homepage,
      image: path,
      category: createStoreInfoDTO.category.split(","),
    },
  });
  return data;
};

// ownerId로 점주 매장 조회
const getStorebyOwnerId = async (id: number) => {
  const data = await prisma.store.findFirst({
    where: {
      ownerId: id,
    },
  });
  console.log("getStorebyOwnerId");
  return data;
};

// storeId로 점주 매장 조회
const getStorebyStoreId = async (storeId: number) => {
  const data = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  });
  console.log("getStorebyStoreId");
  return data;
};

// tourId로 투어 정보 조회
const getTourByTourId = async (tourId: number) => {
  const data = await prisma.tour.findUnique({
    where: {
      id: tourId,
    },
  });
  console.log("getTourByTourId");
  return data;
};

// 투어 제목으로 tourId 조회
const getTourByTourTitle = async (tour: string) => {
  const data = await prisma.tour.findFirst({
    where: {
      title: { contains: tour },
    },
  });
  return data;
};

// 점주 소복 스탬프 서비스 사용 신청
const requestStampSignIn = async (userId: number) => {
  const data = await prisma.stamp_Request.create({
    data: {
      ownerId: userId,
    },
  });
  return data;
};

//** 유저 생성번호로 스탬프 적립 승낙
const grantStampByRandNum = async (
  randNum: string,
  date: Date,
  storeId: number,
  storeName: string,
  tourTitle: string,
  tourId: number
) => {
  console.log("----------");
  console.log("request body: ");
  console.log("storeId: ", storeId);
  console.log("storeName: ", storeName);
  console.log("tourTitle: ", tourTitle);
  console.log("tourId: ", tourId);

  // 유저 생성번호만 등록된 상태인 스탬프
  const stamp = await prisma.stamp.findUnique({
    where: {
      randNum: randNum,
    },
  });

  // 스탬프를 적립한 고객의 id
  const customerId = stamp?.customerId as number;

  // 현재 투어에 적립한 고객의 스탬프 개수 전체
  const totalStampCount = await prisma.stamp.findMany({
    where: {
      customerId: customerId,
      tourId: tourId,
      tour: tourTitle,
    },
  });

  console.log("----------");
  console.log("totalStampCount: ", totalStampCount.length);
  console.log("----------");

  if (totalStampCount.length >= 10) {
    console.log("totalStampCount.length >= 10");
    return;
  } else {
    // 스탬프 적립 승낙
    const data = await prisma.stamp.update({
      where: {
        randNum: randNum,
      },
      data: {
        timestamp: date,
        storeId: storeId,
        store: storeName,
        tour: tourTitle,
        tourId: tourId,
      },
    });

    // 그 고객의 stampCount 증가시키기
    const addStampCount = await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        stampCount: {
          increment: 1,
        },
      },
    });
    console.log("stampCount: ", addStampCount.stampCount);

    console.log("customerId: ", customerId);

    console.log("tourId: ", tourId);

    // 해당 투어에서의 적립한 스탬프 개수가 10의 배수이면 쿠폰 개수 증가
    // 현재 10개를 넘게 적립이 불가하기 때문에 사실상 투어 스탬프 개수가 10개이면 쿠폰 개수가 증가하지 않음
    const tourStamp = await prisma.stamp.findMany({
      where: {
        customerId: customerId,
        tourId: data.tourId,
      },
    });

    const tourStampCount = tourStamp.length;
    console.log("customer", customerId, "'s tourstampcount: ", tourStampCount);

    if (tourStampCount % 10 === 0 && tourStampCount >= 0) {
      const addTourStampCount = await prisma.customer.update({
        where: {
          id: customerId,
        },
        data: {
          couponCount: {
            increment: 1,
          },
        },
      });
      console.log("coupontCount: ", addTourStampCount.couponCount);
      return data;
    } else {
      console.log("if문 탈출: ");
    }
  }
};

// 점주 매장 소식 등록
const createStoreNotice = async (
  createStoreNoticeDTO: CreateStoreNoticeDTO,
  path: string,
  storeId: number,
  date: Date
) => {
  const data = await prisma.store_Notice.create({
    data: {
      category: createStoreNoticeDTO.category,
      title: createStoreNoticeDTO.title,
      content: createStoreNoticeDTO.content,
      image: path,
      storeId: storeId,
      createdTime: date,
    },
  });
  return data;
};

// 점주 매장 메뉴 등록
const createStoreMenu = async (
  createStoreMenuDTO: CreateStoreMenuDTO,
  path: string,
  storeId: number
) => {
  const data = await prisma.store_Menu.create({
    data: {
      title: createStoreMenuDTO.title,
      content: createStoreMenuDTO.content,
      image: path,
      storeId,
    },
  });
  return data;
};

// 점주 스토어 상품 등록
const createStoreProduct = async (
  createStoreProductDTO: CreateStoreProductDTO,
  path: string,
  storeId: number
) => {
  const data = await prisma.store_Product.create({
    data: {
      category: createStoreProductDTO.category,
      name: createStoreProductDTO.name,
      price: createStoreProductDTO.price,
      discountPrice: createStoreProductDTO.discountPrice,
      url: createStoreProductDTO.url,
      image: path,
      storeId,
    },
  });
  return data;
};

// 점주 소복 매니저 서비스 사용 신청
const createAlimRequest = async (
  ownerCreateAlimRequestDTO: OwnerCreateAlimRequestDTO,
  userId: number,
  date: Date
) => {
  const data = await prisma.alim_Request.create({
    data: {
      category: ownerCreateAlimRequestDTO.category,
      content: ownerCreateAlimRequestDTO.content,
      isMessage: ownerCreateAlimRequestDTO.isMessage,
      isKakao: ownerCreateAlimRequestDTO.isKakao,
      writerId: userId,
      timestamp: date,
    },
  });
  return data;
};

const ownerService = {
  getOwnerName,
  findOwnerById,
  createStoreInfo,
  createStoreIdForOwner,
  updateStoreInfo,
  getStorebyOwnerId,
  getStorebyStoreId,
  getTourByTourId,
  getTourByTourTitle,
  requestStampSignIn,
  grantStampByRandNum,
  createStoreNotice,
  createStoreMenu,
  createStoreProduct,
  createAlimRequest,
};

export default ownerService;
