import { Prisma } from ".prisma/client";

export type ProjectDetailType = Prisma.ProjectGetPayload<{
  include: {
    owner: {
      select: {
        id: true;
        email: true;
        username: true;
      };
    };
    clones: {
      select: {
        id: true;
        title: true;
        created_at: true;
        owner: {
          select: {
            id: true;
            username: true;
          };
        };
      };
    };
    cloned_from_project: {
      select: {
        id: true;
        title: true;
        owner: {
          select: {
            id: true;
            username: true;
          };
        };
      };
    };
  };
}>;
