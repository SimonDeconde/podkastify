import { UserById } from '@shared/interfaces';

export type UserDto = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profilePicUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const userToDto = (user: UserById) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    profilePicUrl: user.profilePicUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } as UserDto;
};
