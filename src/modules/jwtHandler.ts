// src/modules/jwtHandler.ts
import jwt from "jsonwebtoken";
import { tokenType } from "../constants";

//* 받아온 userId를 담는 access token 생성
const sign = (id: number) => {
  const payload = {
    id,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "2h",
  });
  return accessToken;
};

//* token 검사!
const verify = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    if (error.message === "jwt expired") {
      console.log("토큰 만료");
      return tokenType.TOKEN_EXPIRED;
    } else if (error.message === "invalid token") {
      console.log("invalid token");
      console.log(error);
      return tokenType.TOKEN_INVALID;
    } else {
      console.log("invalid token");
      console.log(error);
      return tokenType.TOKEN_INVALID;
    }
  }

  return decoded;
};

export default {
  sign,
  verify,
};
