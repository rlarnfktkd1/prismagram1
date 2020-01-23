import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};

/**
 * @description 해당 유저가 맞는지 확인 해준다. 맞으면 뒤에에 정보를 싣어서 보내준다.
 * @param {*} payload
 * @param {*} done
 * @returns done안에 user를 싣어보내준다. (성공시)  에러시 err와 false boolean을 싣어보내준다.
 */
const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });

    if (!!user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (e) {
    console.log(e);
    return done(err, false);
  }
};

export const authenticateJwt = (req, res, next) => {
  return passport.authenticate("jwt", { sessions: false }, (error, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
