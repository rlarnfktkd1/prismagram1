import { generateToken } from "../../../utils";

export default {
  Mutation: {
    confirmSecret: async (_, args, { request, prisma }) => {
      const { secret, email } = args;

      const user = await prisma.user({ email });
      console.log(request);

      if (user.loginSecret === secret) {
        const token = generateToken(user.id);
        return token;
      } else {
        throw Error("Wrong email/secret combination");
      }
    }
  }
};
