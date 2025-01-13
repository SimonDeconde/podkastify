import { Avatar, AvatarGroup } from '@nextui-org/avatar';
import { Tooltip } from '@nextui-org/tooltip';
import { InvitationDto } from '@server/invitation/entities/invitation.entity';

type Props = {
  invitations: InvitationDto[];
};

export const InvitationAvatarGroup = ({ invitations }: Props) => {
  if (invitations.length === 0) {
    return <div className="text-sm">{invitations.length} going</div>;
  }

  return (
    <div className="ml-3 flex items-center gap-2">
      <AvatarGroup isBordered max={3}>
        {invitations.map((invitation) => (
          <Tooltip
            key={invitation.id}
            content={invitation.userFullName}
            color="secondary"
            size="sm"
          >
            <Avatar key={invitation.id} src={invitation.userProfilePicUrl} />
          </Tooltip>
        ))}
      </AvatarGroup>
      <div className="text-sm">{invitations.length} going</div>
    </div>
  );
};
