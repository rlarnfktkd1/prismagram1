import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request }) => {
      isAuthenticated(request);
      const { postId } = args;
      const { user } = request;

      try {
        const filterOptions = {
          AND: [
            {
              user: {
                id: user.id
              },
              post: {
                id: postId
              }
            }
          ]
        };
        const existingLike = await prisma.$exists.like(filterOptions);

        if (existingLike) {
          await prisma.deleteManyLikes(filterOptions);
          return false;
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            post: {
              connect: {
                id: postId
              }
            }
          });
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
