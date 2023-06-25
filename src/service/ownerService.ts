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

const prisma = new PrismaClient();

// 점주 유저 회원정보 수정
const updateOwner = async (id: number, ownerUpdateDTO: OwnerUpdateDTO) => {
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
      licenseImage: ownerUpdateDTO.licenseImage,
    },
  });
  return data.id;
};

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

// 점주 매장정보 등록
const createStoreInfo = async (
  createStoreInfoDTO: CreateStoreInfoDTO,
  ownerId: number,
  path: string
) => {
  const data = await prisma.store.create({
    data: {
      storeName: createStoreInfoDTO.storeName,
      description: createStoreInfoDTO.description,
      officeHour: createStoreInfoDTO.officeHour,
      dayOff: createStoreInfoDTO.dayOff,
      homepage: createStoreInfoDTO.homepage,
      image: path,
      category: createStoreInfoDTO.category,
      ownerId,
    },
  });
  return data;
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
      category: createStoreInfoDTO.category,
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
  return data?.id;
};

// storeId로 점주 매장 조회
const getStorebyStoreId = async (storeId: number) => {
  const data = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  });
  return data;
};

// 점주 매장 소식 등록
const createStoreNotice = async (
  createStoreNoticeDTO: CreateStoreNoticeDTO,
  path: string,
  storeId: number,
  date: EpochTimeStamp
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

// tourId로 투어 정보 조회
const getTourByTourId = async (tourId: number) => {
  const data = await prisma.tour.findUnique({
    where: {
      id: tourId,
    },
  });
  return data;
};

// 투어 제목으로 tourId 조회
const getTourByTourTitle = async (tour: string) => {
  const data = await prisma.tour.findFirst({
    where: {
      title: tour,
    },
  });
  return data;
};

// 유저 생성번호로 스탬프 적립 승낙
const grantStampByRandNum = async (
  randNum: string,
  date: EpochTimeStamp,
  storeId: number,
  storeName: string,
  tourTitle: string,
  tourId: number
) => {
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
  return data;
};

const ownerService = {
  updateOwner,
  getOwnerName,
  findOwnerById,
  createStoreInfo,
  createStoreIdForOwner,
  updateStoreInfo,
  getStorebyOwnerId,
  getStorebyStoreId,
  getTourByTourId,
  getTourByTourTitle,
  grantStampByRandNum,
  createStoreNotice,
  createStoreMenu,
  createStoreProduct,
};

export default ownerService;
