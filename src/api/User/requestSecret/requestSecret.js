import { generateSecret } from "../../../utils";
import { sendSecretMail } from "../../../utils";

export default {
  Mutation: {
    requestSecret: async (_, args, { prisma }) => {
      const { email } = args;
      const secret = generateSecret();

      try {
        await prisma.updateUser({
          data: { loginSecret: secret },
          where: { email }
        });

        await sendSecretMail(email, secret);

        return true;
      } catch (e) {
        console.log(e);

        return false;
      }
    }
  }
};
