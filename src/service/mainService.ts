import { CreateStoreReviewDTO } from "./../interfaces/store/createStoreReviewDTO";
import { PrismaClient, Stamp, Store } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";
import axios from "axios";

const prisma = new PrismaClient();

// 카페 찜하기
const createLikeCafe = async (storeId: number, customerId: number) => {
  const data = await prisma.store_Like.create({
    data: {
      customerId: customerId,
      storeId: storeId,
    },
  });
  return data;
};

// 카페 찜 해제
const deleteLikeCafe = async (storeId: number, customerId: number) => {
  const likedStore = await prisma.store_Like.findFirst({
    where: {
      customerId: customerId,
      storeId: storeId,
    },
  });
  const data = await prisma.store_Like.delete({
    where: {
      id: likedStore?.id,
    },
  });
  return data;
};

// 유저 근처 카페 전체 조회
// const getAllCafe = async (x: number, y: number, category: Array<string>) => {
//   // 전제 1: 투어에 포함된 카페 전체 조회
//   const allTourCafe = await prisma.store.findMany({
//     where: {
//       tourId: { not: null },
//       category: { hasEvery: category },
//     },
//   });

//   // 현위치 좌표와 카페 좌표 사이의 거리 계산
//   for (let i = 0; i < allTourCafe.length; i++) {
//     // 전제 2: 카페의 도로명 주소가 정확히 기입되어 x, y 좌표가 등록된 상태
//     if (
//       allTourCafe !== null &&
//       allTourCafe[i].x !== null &&
//       allTourCafe[i].y !== null
//     ) {
//       let cafeX = +allTourCafe[i].x;
//       let cafeY = +allTourCafe[i].y;
//       // 좌표평면상 두 좌표 사이의 거리
//       let distance = Math.sqrt(
//         Math.pow(+x - cafeX, 2) + Math.pow(+y - cafeY, 2)
//       );
//       // 전체 카페 배열 내의 카페 객체 각각의 distance 필드 업데이트
//       const store = await prisma.store.update({
//         where: {
//           id: allTourCafe[i].id,
//         },
//         data: {
//           distance: distance * 100000,
//         },
//       });
//       allTourCafe[i].distance = distance * 100000; // m 단위에 맞게 곱셈하여 추가
//     }
//   }
//   console.log(allTourCafe);

//   // sort 함수로 정렬
//   const sortAllTourCafe = allTourCafe.sort(function (a, b) {
//     return a.distance - b.distance;
//   });
//   return sortAllTourCafe;
// };

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
const getCafeNoticeById = async (id: number, query: string) => {
  if (query === "all") {
    const allNotice = await prisma.store_Notice.findMany({
      where: {
        storeId: id,
      },
    });
    return allNotice;
  }

  if (query !== "all") {
    switch (query) {
      case "menu":
        const menuNotice = await prisma.store_Notice.findMany({
          where: {
            storeId: id,
            category: { contains: "메뉴" }, // 신메뉴 소식만 조회
          },
        });
        return menuNotice;
      case "sale":
        const saleNotice = await prisma.store_Notice.findMany({
          where: {
            storeId: id,
            category: { contains: "이벤트" }, // 할인/이벤트 소식만 조회
          },
        });
        return saleNotice;
    }
  }
};

// 유저 근처 카페 개별 업체 메뉴 조회
const getCafeMenuById = async (storeId: number) => {
  const data = await prisma.store_Menu.findMany({
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

// 유저 근처 카페 개별 업체 피드 작성
const createCafeReviewById = async (
  writerId: number,
  storeId: number,
  createStoreReviewDTO: CreateStoreReviewDTO,
  path: string,
  date: Date
) => {
  const data = await prisma.store_Review.create({
    data: {
      title: createStoreReviewDTO.title,
      content: createStoreReviewDTO.content,
      image: path,
      timestamp: date,
      writerId: writerId,
      storeId: storeId,
    },
  });
  return data;
};

// 소복 스토어 상품 조회
const getCafeStoreProducts = async (sort: string) => {
  if (sort !== "all") {
    switch (sort) {
      case "cookie":
        const cookie = await prisma.store_Product.findMany({
          where: {
            category: "수제 쿠키",
          },
        });
        return cookie;
      case "cake":
        const cake = await prisma.store_Product.findMany({
          where: {
            category: "수제 케이크",
          },
        });
        return cake;
      case "bean":
        const bean = await prisma.store_Product.findMany({
          where: {
            category: "원두",
          },
        });
        return bean;
    }
  }

  if (sort === "all") {
    const data = await prisma.store_Product.findMany({
      where: {
        storeId: { not: null },
      },
    });
    return data;
  }
};

// 고객 마이페이지 조회
const getCustomerMyPage = async (customerId: number) => {
  // 유저 이름 조회
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  const customerName = customer?.name;

  // 찜한 카페 전체 조회
  const allStoreLike = await prisma.store_Like.findMany({
    where: {
      customerId: customerId,
    },
  });

  let allLikeCafe: Array<any> = [];
  for (let i = 0; i < allStoreLike.length; i++) {
    let likeCafe = await prisma.store.findUnique({
      where: {
        id: allStoreLike[i].storeId,
      },
    });
    allLikeCafe.push(likeCafe);
  }

  // 내가 작성한 리뷰 전체 조회
  const allStoreReview = await prisma.store_Review.findMany({
    where: {
      writerId: customerId,
    },
  });

  return { customerName, allLikeCafe, allStoreReview };
};

const mainService = {
  createLikeCafe,
  deleteLikeCafe,
  //getAllCafe,
  getCafeById,
  getCafeNoticeById,
  getCafeMenuById,
  getCafeReviewById,
  createCafeReviewById,
  getCafeStoreProducts,
  getCustomerMyPage,
};
export default mainService;
