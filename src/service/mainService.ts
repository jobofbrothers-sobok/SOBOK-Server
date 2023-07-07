import { PrismaClient, Stamp } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import axios from "axios";

const prisma = new PrismaClient();

// 유저 근처 카페 전체 조회
const getAllCafe = async (x: number, y: number) => {
  // 투어에 포함된 카페 전체 조회
  const allTourCafe = await prisma.store.findMany({
    where: {
      tourId: { not: null },
    },
  });
};
// 유저 근처 카페 개별 업체 정보 조회
const getCafeById = async (storeId: number) => {
  const data = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  });
  return data;
};

// 유저 근처 카페 개별 업체 소식 조회
const getCafeNoticeById = async (id: number) => {
  const data = await prisma.store_Notice.findMany({
    where: {
      storeId: id,
    },
  });
  return data;
};

// 유저 근처 카페 개별 업체 메뉴 조회
const getCafeMenuById = async (storeId: number) => {
  const data = await prisma.store_Menu.findFirst({
    where: {
      storeId: storeId,
    },
  });
  return data;
};

// 유저 근처 카페 개별 업체 피드 조회
const getCafeReviewById = async (storeId: number) => {
  const data = await prisma.store_Review.findMany({
    where: {
      storeId: storeId,
    },
  });
  return data;
};
const mainService = {
  getAllCafe,
  getCafeById,
  getCafeNoticeById,
  getCafeMenuById,
  getCafeReviewById,
};
export default mainService;
