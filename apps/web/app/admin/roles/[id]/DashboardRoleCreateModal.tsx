import { zodResolver } from '@hookform/resolvers/zod';
import { RoleCreateDto, RoleCreateDtoType } from '@server/role/role.dto';
import { Dialog } from '@web/components/Dialog';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type DashboardRoleCreateModalProps = {
  onClose: () => void;
};
export default function DashboardRoleCreateModal(
  props: DashboardRoleCreateModalProps,
) {
  const { trpc } = useTrpc();
  const createRole = trpc.roleRouter.create.useMutation();
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RoleCreateDtoType>({
    resolver: zodResolver(RoleCreateDto),
  });
  return (
    <Dialog
      onClose={() => {
        if (props.onClose) {
          props.onClose();
        }
      }}
    >
      <div className="pointer-events-auto flex flex-col rounded-xl border bg-white px-2 pb-10 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
        <div className="mt-8">
          <div className="text-center">
            <h2 className="block text-2xl font-bold text-gray-800 dark:text-gray-200">
              Add a new role
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              * means required
            </p>
          </div>
        </div>
        <div className="overflow-y-auto p-4">
          <form
            onSubmit={handleSubmit(async (data) => {
              try {
                const role = await createRole.mutateAsync(data);
                toast.success('Role added');
                if (role) {
                  router.push(`/dashboard/roles/${role.id}`);
                }
              } catch (e) {}
            })}
          >
            <div className="grid gap-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm dark:text-white"
                >
                  Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('name')}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600"
                    required
                    aria-describedby="name-error"
                  />
                  <div className="pointer-events-none absolute inset-y-0 end-0 hidden pe-3">
                    <svg
                      className="size-5 text-red-500"
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </div>
                </div>
                {errors.name && (
                  <p className="mt-2 text-xs text-red-600" id="name-error">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={createRole.isLoading}
                className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                {createRole.isLoading ? 'Adding ...' : 'Add'}
              </button>
            </div>
            {createRole.error && (
              <p className="mt-4 text-center text-sm text-red-600">
                {createRole.error.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </Dialog>
  );
}
