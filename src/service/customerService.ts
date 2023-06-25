import { CreateDeliveryRequestDTO } from "./../interfaces/delivery/createDeliveryRequestDTO";
import { PrismaClient, Stamp } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import { CustomerCreateDTO } from "../interfaces/user/customerCreateDTO";
import { UserSignInDTO } from "../interfaces/user/userSignInDTO";
import { CustomerUpdateDTO } from "./../interfaces/user/customerUpdateDTO";
import ownerService from "./ownerService";

const prisma = new PrismaClient();

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

// 고객 스탬프 배송 신청
const createDeliveryRequest = async (
  id: number,
  createDeliveryRequestDTO: CreateDeliveryRequestDTO
) => {
  const data = await prisma.delivery.create({
    data: {
      reward: createDeliveryRequestDTO.reward,
      customer: createDeliveryRequestDTO.customer,
      phone: createDeliveryRequestDTO.phone,
      address: createDeliveryRequestDTO.address,
      detailAddress: createDeliveryRequestDTO.detailAddress,
      message: createDeliveryRequestDTO.message,
      customerId: id,
    },
  });
  return data;
};

const customerService = {
  getCustomerName,
  findCustomerById,
  createStampNumber,
  getAllStamp,
  createDeliveryRequest,
  getAllTourStore,
};

export default customerService;
