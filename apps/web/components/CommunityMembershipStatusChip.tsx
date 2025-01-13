import { Chip } from '@nextui-org/chip';
import { Tooltip } from '@nextui-org/tooltip';
import { CommunityMembershipStatus } from '@prisma/client';
import { CommunityMembershipDto } from '@server/community-membership/entities/community-membership.entity';

type Props = {
  membership: CommunityMembershipDto;
};

export const CommunityMembershipStatusChip = ({ membership }: Props) => {
  const tooltipContent =
    membership.status === CommunityMembershipStatus.paused
      ? 'You have paused new invitations'
      : 'You will receive invitations to new events in this community';
  const color =
    membership.status === CommunityMembershipStatus.paused
      ? 'warning'
      : 'success';
  const text =
    membership.status === CommunityMembershipStatus.paused
      ? 'Paused'
      : 'Available';
  return (
    <Tooltip content={tooltipContent} color="secondary">
      <Chip size="sm" color={color} variant="dot">
        {text}
      </Chip>
    </Tooltip>
  );
};
