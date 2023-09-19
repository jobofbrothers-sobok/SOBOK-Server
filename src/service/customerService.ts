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
      case "sookmyung":
        const sookmyung: any = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: { contains: "숙명" },
          },
        });
        for (let i = 0; i < sookmyung.length; i++) {
          sookmyung[i].inquiryCount = inquiryCount;
        }
        return sookmyung;
      case "itaewon":
        const itaewon: any = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: { contains: "이태원" },
          },
        });
        for (let i = 0; i < itaewon.length; i++) {
          itaewon[i].inquiryCount = inquiryCount;
        }
        return itaewon;
      case "kyunghee":
        const kyunghee: any = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: { contains: "경희" },
          },
        });
        for (let i = 0; i < kyunghee.length; i++) {
          kyunghee[i].inquiryCount = inquiryCount;
        }
        return kyunghee;
      case "chungang":
        const chungang: any = await prisma.stamp.findMany({
          where: {
            customerId: id,
            tour: { contains: "중앙" },
          },
        });
        for (let i = 0; i < chungang.length; i++) {
          chungang[i].inquiryCount = inquiryCount;
        }
        return chungang;
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
    case "sookmyung":
      tourTitle = "숙명";
      const sookmyungTour = await ownerService.getTourByTourTitle(tourTitle);
      const sookmyung = await prisma.store.findMany({
        where: {
          tourId: sookmyungTour?.id,
        },
      });
      return sookmyung;
    case "itaewon":
      tourTitle = "이태원";
      const itaewonTour = await ownerService.getTourByTourTitle(tourTitle);
      const itaewon = await prisma.store.findMany({
        where: {
          tourId: itaewonTour?.id,
        },
      });
      return itaewon;
    case "kyunghee":
      tourTitle = "경희";
      const kyungheeTour = await ownerService.getTourByTourTitle(tourTitle);
      const kyunghee = await prisma.store.findMany({
        where: {
          tourId: kyungheeTour?.id,
        },
      });
      return kyunghee;
    case "chungang":
      tourTitle = "중앙";
      const chungangTour = await ownerService.getTourByTourTitle(tourTitle);
      const chungang = await prisma.store.findMany({
        where: {
          tourId: chungangTour?.id,
        },
      });
      return chungang;
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
