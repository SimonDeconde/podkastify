import { InvitationDto } from '@server/invitation/entities/invitation.entity';
import { RoutePath } from '@shared/route-path';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { InviteStatusBadge } from './Badge';
import { UserProfile } from './UserProfile';

type Props = {
  invitation: InvitationDto;
};

export const GuestInvitationCard = ({ invitation }: Props) => {
  const lastStatusUpdateTime = `Invitation last updated ${formatDistance(
    invitation.statusDt,
    new Date(),
    {
      addSuffix: true,
    },
  )}`;

  return (
    <div className="mt-2 flex min-w-0 items-center justify-between">
      <UserProfile
        userId={invitation.userId}
        fullName={invitation.userFullName}
        profilePicUrl={invitation.userProfilePicUrl}
      />
      <div className="text-right" title={lastStatusUpdateTime}>
        <Link
          href={RoutePath.INVITATION.replace('[id]', invitation.id)}
          className="text-sm font-medium"
        >
          <p className="text-sm leading-6 text-gray-900">
            <InviteStatusBadge status={invitation.status} />
          </p>
        </Link>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {invitation.statusDt && (
            <time dateTime={invitation.statusDt.toDateString()}>{}</time>
          )}
        </p>
      </div>
    </div>
  );
};
