import { Avatar, AvatarGroup } from '@heroui/react';
import { UserDto } from '@server/user/entities/user.entity';

type Props = {
  users: UserDto[];
};

export const UserAvatarGroup = ({ users }: Props) => {
  return (
    <AvatarGroup isBordered>
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
    </AvatarGroup>
  );
};
