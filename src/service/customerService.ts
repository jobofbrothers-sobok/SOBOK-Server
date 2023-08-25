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
  const inquiry = await prisma.delivery.findMany({
    where: {
      customerId: id,
    },
  });
  const inquiryCount = inquiry.length;

  if (sort !== "all") {
    switch (sort) {
      case "hoegi":
        const hoegi: any = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: { contains: "회기" },
          },
        });
        for (let i = 0; i < hoegi.length; i++) {
          hoegi[i].inquiryCount = inquiryCount;
        }
        return hoegi;
      case "sookmyung":
        const sookmyung: any = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: { contains: "숙대" },
          },
        });
        for (let i = 0; i < sookmyung.length; i++) {
          sookmyung[i].inquiryCount = inquiryCount;
        }
        return sookmyung;
      case "halloween":
        const halloween: any = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: { contains: "할로윈" },
          },
        });
        for (let i = 0; i < halloween.length; i++) {
          halloween[i].inquiryCount = inquiryCount;
        }
        return halloween;
      case "xmas":
        const xmas: any = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: { contains: "크리스마스" },
          },
        });
        for (let i = 0; i < xmas.length; i++) {
          xmas[i].inquiryCount = inquiryCount;
        }
        return xmas;
    }
  }

  if (sort === "all") {
    const data: any = await prisma.stamp.findMany({
      where: {
        customerId: id,
      },
    });
    for (let i = 0; i < data.length; i++) {
      data[i].inquiryCount = inquiryCount;
    }
    return data;
  }
};

// 고객 스탬프 투어 참여 매장 조회
const getAllTourStore = async (sort: string) => {
  let tourTitle;
  switch (sort) {
    case "hoegi":
      tourTitle = "회기";
      const hoegiTour = await ownerService.getTourByTourTitle(tourTitle);
      const hoegi = await prisma.store.findMany({
        where: {
          tourId: hoegiTour?.id,
        },
      });
      return hoegi;
    case "sookmyung":
      tourTitle = "숙대";
      const sookTour = await ownerService.getTourByTourTitle(tourTitle);
      const sookmyung = await prisma.store.findMany({
        where: {
          tourId: sookTour?.id,
        },
      });
      return sookmyung;
    case "halloween":
      tourTitle = "할로윈";
      const halloweenTour = await ownerService.getTourByTourTitle(tourTitle);
      const halloween = await prisma.store.findMany({
        where: {
          tourId: halloweenTour?.id,
        },
      });
      return halloween;
    case "xmas":
      tourTitle = "크리스마스";
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
