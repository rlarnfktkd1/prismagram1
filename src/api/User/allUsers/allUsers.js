export default {
  Query: {
    allUsers: ({ prisma }) => prisma.users()
  }
};
