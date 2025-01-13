import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { Select, SelectItem } from '@nextui-org/select';
import type { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { RoutePath } from '@shared/route-path';
import { getEmailRelevantName } from '@shared/utils';
import { useUserContext } from '@web/app/user/UserContext';
import { useTrpc } from '@web/contexts/TrpcContext';
import { toast } from 'sonner';
import { LoadingSpinner } from './LoadingSpinner';

export const QuickUserSwitchModal = ({
  disclosure,
}: {
  disclosure: UseDisclosureReturn;
}) => {
  const { trpc } = useTrpc();

  const quickLogin = trpc.userRouter.quickLogin.useMutation();
  const { currentUser, setCurrentUser, setAccessToken } = useUserContext();

  const userListPayload = trpc.userRouter.findAll.useQuery({ perPage: 1000 });

  if (!userListPayload.data) {
    return <LoadingSpinner />;
  }

  const userList = userListPayload.data;

  const sortedUserList = userList.records.sort((a, b) => {
    if (a.email < b.email) {
      return -1;
    }
    if (a.email > b.email) {
      return 1;
    }
    return 0;
  });

  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              User quick switch
            </ModalHeader>
            <ModalBody>
              <form>
                <Select
                  label="Select a user"
                  onChange={async (e) => {
                    try {
                      const userJwt = await quickLogin.mutateAsync({
                        id: e.target.value,
                      });
                      if (userJwt.user && setCurrentUser) {
                        setAccessToken(
                          userJwt.jwt.accessToken,
                          userJwt.jwt.expiresIn,
                        );
                        setCurrentUser(userJwt.user);
                      }

                      window.location.href = RoutePath.DASHBOARD;
                      onClose();
                    } catch (e) {
                      toast.error('There was a problem during quick login');
                    }
                  }}
                >
                  {sortedUserList.map((user) => (
                    <SelectItem key={user.id}>
                      {getEmailRelevantName(user.email)}
                    </SelectItem>
                  ))}
                </Select>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
