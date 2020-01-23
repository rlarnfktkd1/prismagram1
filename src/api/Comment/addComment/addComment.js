import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    addComment: async (_, args, { request }) => {
      const { user } = request;
      const { postId, text } = args;
      isAuthenticated(request);

      try {
        const comment = await prisma.createComment({
          user: {
            connect: {
              id: user.id
            }
          },
          post: {
            connect: {
              id: postId
            }
          },
          text
        });
        return comment;
      } catch (e) {
        return e;
      }
    }
  }
};
