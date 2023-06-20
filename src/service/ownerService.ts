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
      storeId: 9,
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

// 점주 유저 회원탈퇴
const ownerDelete = async (id: number) => {
  const data = await prisma.store_Owner.delete({
    where: {
      id: id,
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
  ownerId: number
) => {
  const data = await prisma.store.create({
    data: {
      storeName: createStoreInfoDTO.storeName,
      description: createStoreInfoDTO.description,
      officeHour: createStoreInfoDTO.officeHour,
      dayOff: createStoreInfoDTO.dayOff,
      homepage: createStoreInfoDTO.homepage,
      image: createStoreInfoDTO.image,
      category: createStoreInfoDTO.category,
      ownerId,
    },
  });
  return data;
};

// 점주 매장정보 수정
const updateStoreInfo = async (
  storeId: number,
  createStoreInfoDTO: CreateStoreInfoDTO
) => {
  console.log(storeId);
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
      image: createStoreInfoDTO.image,
      category: createStoreInfoDTO.category,
    },
  });
  return data;
};

// 점주 매장 조회
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
  return data?.storeName;
};

// 점주 매장 소식 등록
const createStoreNotice = async (
  createStoreNoticeDTO: CreateStoreNoticeDTO,
  storeId: number
) => {
  const data = await prisma.store_Notice.create({
    data: {
      category: createStoreNoticeDTO.category,
      title: createStoreNoticeDTO.title,
      content: createStoreNoticeDTO.content,
      image: createStoreNoticeDTO.image,
      storeId: storeId,
    },
  });
  console.log(storeId);
  return data;
};

// 점주 매장 메뉴 등록
const createStoreMenu = async (
  createStoreMenuDTO: CreateStoreMenuDTO,
  storeId: number
) => {
  const data = await prisma.store_Menu.create({
    data: {
      title: createStoreMenuDTO.title,
      content: createStoreMenuDTO.content,
      image: createStoreMenuDTO.image,
      storeId,
    },
  });
  return data;
};

// 점주 스토어 상품 등록
const createStoreProduct = async (
  createStoreProductDTO: CreateStoreProductDTO,
  storeId: number
) => {
  const data = await prisma.store_Product.create({
    data: {
      category: createStoreProductDTO.category,
      name: createStoreProductDTO.name,
      price: createStoreProductDTO.price,
      discountPrice: createStoreProductDTO.discountPrice,
      url: createStoreProductDTO.url,
      image: createStoreProductDTO.image,
      storeId,
    },
  });
  return data;
};

const ownerService = {
  createOwner,
  ownerSignIn,
  updateOwner,
  ownerDelete,
  getOwnerName,
  findOwnerById,
  createStoreInfo,
  updateStoreInfo,
  getStorebyOwnerId,
  getStorebyStoreId,
  createStoreNotice,
  createStoreMenu,
  createStoreProduct,
};

export default ownerService;
