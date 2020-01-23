import dotenv from "dotenv";
dotenv.config();
// 랜덤 문장
import { nouns, adjectives } from "./words";
/* 메일 보내기 위한 모듈 */
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
/* jwt 토큰 생성 모듈 */
import jwt from "jsonwebtoken";

/**
 * @description 첫 로그인 시에 이메일 인증 겸 랜덤한 문장 추출
 * @public
 */
export const generateSecret = () => {
  const random1 = Math.floor(Math.random() * adjectives.length);
  const random2 = Math.floor(Math.random() * nouns.length);

  return `${adjectives[random1]} ${nouns[random2]}`;
};

/**
 * @description SendGrid와 nodemailer를 합쳐서 해당 이메일 내용을 받아서 진짜 이메일 전송
 * @public
 */
export const sendMail = email => {
  const options = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };

  const client = nodemailer.createTransport(sgTransport(options));

  return client.sendMail(email);
};

/**
 * @description sendMail 함수 이용 전에 graphql resolver에서 이메일 주소와 시크릿 코드를 전달 받는다.
 * @summary 추후 위에서 선언한 sendMail 함수를 실행 시켜준다.
 * @param {*} address
 * @param {*} secret
 */
export const sendSecretMail = (address, secret) => {
  const email = {
    from: "nico@prismagram.com",
    to: address,
    subject: "🔒Login Secret for Prismagram🔒",
    html: `Hello Your login Answer is [<strong>${secret}</strong>].<br />Copy Paste on the app/website to Log in`
  };

  return sendMail(email);
};

export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET_KEY);
