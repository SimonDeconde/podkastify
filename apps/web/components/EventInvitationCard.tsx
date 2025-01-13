import { InvitationStatus } from '@prisma/client';
import { InvitationDto } from '@server/invitation/entities/invitation.entity';
import { RoutePath } from '@shared/route-path';
import { formatDateTimeSpan, replaceAll } from '@shared/utils';
import { useTrpc } from '@web/contexts/TrpcContext';
import Link from 'next/link';
import { LoadingSpinner } from './LoadingSpinner';

type Props = {
  invitation: InvitationDto;
  onUpdate?: () => void;
};

export const EventInvitationCard = ({ invitation, onUpdate }: Props) => {
  const { trpc } = useTrpc();

  const eventPayload = trpc.eventRouter.findById.useQuery({
    id: invitation.eventId,
  });

  const updateInvitationStatus =
    trpc.invitationRouter.updateStatus.useMutation();

  if (!eventPayload.data) {
    return <LoadingSpinner />;
  }

  const event = eventPayload.data;

  const updateInvitationCallback = async (status: InvitationStatus) => {
    await updateInvitationStatus.mutateAsync({
      id: invitation.id,
      status,
    });

    if (onUpdate) {
      onUpdate();
    }

    // setTimeout(() => {
    //   console.log('Redirecting to event page...');
    //   router.replace(RoutePath.EVENT.replace('[id]', invitation.eventId));
    // }, 500);
  };

  const isPending = invitation.status === InvitationStatus.pending;

  return (
    <div className="flex items-center">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          <Link
            href={replaceAll(RoutePath.EVENT, {
              '[id]': event.id,
            })}
          >
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {event.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {formatDateTimeSpan(event.fromDt, event.toDt)}
              </p>
            </div>
          </Link>
        </p>
        {/* <p className="truncate text-sm text-gray-500 dark:text-gray-400">
            {attendeeSummaryString(invitationsPayload?.data)}
          </p> */}
      </div>
      <div className="flex flex-col items-center space-x-4 text-base font-semibold text-gray-900 dark:text-white">
        {isPending && (
          <>
            <button
              type="button"
              className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              onClick={async () => {
                updateInvitationCallback(InvitationStatus.accepted);
              }}
            >
              Accept
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              onClick={async () => {
                updateInvitationCallback(InvitationStatus.rejected);
              }}
            >
              Can't make it!
            </button>
          </>
        )}
      </div>
    </div>
  );
};
