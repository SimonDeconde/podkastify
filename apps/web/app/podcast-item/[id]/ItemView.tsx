'use client';

import {
  BoltIcon,
  ClockIcon,
  MapIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/button';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import { formatDateTimeSpan } from '@shared/utils';
import { useUserContext } from '@web/app/user/UserContext';
import { EventStatusBadge } from '@web/components/Badge';
import { EventInvitationActionStatus } from '@web/components/EventInvitationActionStatus';
import { GuestInvitationList } from '@web/components/GuestInvitationList';
import { GuestInvitationStats } from '@web/components/GuestInvitationStats';
import { LoadingSpinner } from '@web/components/LoadingSpinner';
import { SectionCard } from '@web/components/SectionCard';
import { UserProfile } from '@web/components/UserProfile';
import { useTrpc } from '@web/contexts/TrpcContext';
import { isFuture } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

type Props = {
  item?: PodcastItemDto;
};

export const ItemView = ({ item }: Props) => {
  const { trpc } = useTrpc();
  const { currentUser } = useUserContext();

  if (!item) {
    // No op.
    return null;
  }
  const itemPayload = trpc.podcastEntryRouter.findById.useQuery({
    id: item.id,
  });

  if (!itemPayload.data) {
    return <LoadingSpinner />;
  }

  const invitations = invitationPayload.data;

  const isCurrentUserHost = event.userId === currentUser?.id;

  const currentInvitation = invitations.find(
    (invite) => invite.userId === currentUser?.id,
  );

  return (
    <div className="mt-8 pb-12 pt-6 lg:pt-10">
      <div className="max-w-full">
        {/* Content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="order-last md:order-first">
            <SectionCard title="Hosted by">
              <UserProfile
                userId={event.hostUserId}
                fullName={event.hostUserFullName}
                profilePicUrl={event.hostUserProfilePicUrl}
              />
            </SectionCard>
            <SectionCard
              title="Attendance overview"
              infoHoverText={`Once your dinner is in status 'Pending', the system will start inviting guests automatically.`}
            >
              {invitations?.length === 0 ? (
                <i className="mb-2">No guests invited yet.</i>
              ) : (
                <>
                  {invitationStatsPayload.data && (
                    <GuestInvitationStats
                      stats={invitationStatsPayload.data}
                      event={event}
                    />
                  )}
                </>
              )}
            </SectionCard>

            <SectionCard title="Guest list">
              <GuestInvitationList invitations={invitations} />
            </SectionCard>
          </div>
          <div className="col-span-2">
            <h2 className="mb-4 flex items-center text-left text-xl font-bold md:text-2xl">
              <span className="mr-2">{event.name}</span>
              <EventStatusBadge status={event.status} />
            </h2>

            <div className="w-full max-w-[360px] rounded-small border-small border-default-200 px-1 py-2">
              <Listbox
                variant="flat"
                aria-label="Listbox menu with descriptions"
              >
                <ListboxItem
                  key="datetime"
                  showDivider
                  startContent={<ClockIcon className="h-6 w-6" />}
                >
                  {formatDateTimeSpan(event.fromDt, event.toDt)}
                </ListboxItem>
                <ListboxItem
                  key="address"
                  showDivider
                  startContent={<MapIcon className="h-6 w-6" />}
                >
                  {event.address ? (
                    <Link
                      href={`https://www.google.com/maps/place/${encodeURIComponent(event.address.replaceAll(' ', '+'))}`}
                      target="_blank"
                    >
                      {event.address}
                    </Link>
                  ) : (
                    <i>Not provided</i>
                  )}
                </ListboxItem>
                <ListboxItem
                  key="nbGuests"
                  startContent={<UserIcon className="h-6 w-6" />}
                >
                  {event.minGuests} to {event.maxGuests} guest(s)
                </ListboxItem>
              </Listbox>
            </div>

            {currentInvitation && (
              <SectionCard title="Your invitation status">
                <EventInvitationActionStatus
                  invitation={currentInvitation}
                  event={event}
                  onUpdate={() => invitationPayload.refetch()}
                />
              </SectionCard>
            )}

            {isCurrentUserHost && (
              <SectionCard
                title="You have manage access for this event"
                isImportant={true}
              >
                {isFuture(event.toDt) ? (
                  <div className="flex gap-4">
                    <Button
                      isLoading={inviteGuests.isLoading}
                      onClick={async () => {
                        const result = await inviteGuests.mutateAsync({
                          id: event.id,
                        });
                        toast(
                          `${result.invitedUserCount} new guest(s) invited!`,
                        );
                        invitationPayload.refetch();
                      }}
                      color="primary"
                      startContent={<BoltIcon className="h-5 w-5" />}
                    >
                      Invite guests
                    </Button>
                    <Button
                      isLoading={voidPendingGuests.isLoading}
                      onClick={async () => {
                        const result = await voidPendingGuests.mutateAsync({
                          id: event.id,
                        });
                        toast(
                          `${result.voidedInvitationCount} guest invitation(s) voided`,
                        );
                        invitationPayload.refetch();
                      }}
                    >
                      Void pending invitations
                    </Button>
                    <Button
                      isLoading={removeGuests.isLoading}
                      onClick={async () => {
                        const result = await removeGuests.mutateAsync({
                          id: event.id,
                        });
                        toast(
                          `${result.deletedInvitationCount} guest invitation(s) deleted`,
                        );
                        invitationPayload.refetch();
                      }}
                    >
                      Remove all guests
                    </Button>
                  </div>
                ) : (
                  <i>This event is over</i>
                )}
              </SectionCard>
            )}

            <SectionCard title="About event">
              {event.description ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: event.description.replaceAll('\n', '<br/>') || '',
                  }}
                />
              ) : (
                <i>No description provided.</i>
              )}
            </SectionCard>
          </div>
        </div>
        {/* End Content */}
      </div>
    </div>
  );
};
