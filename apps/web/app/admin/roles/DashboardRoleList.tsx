'use client';

import { useTrpc } from '@web/contexts/TrpcContext';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import DashboardRoleCreateModal from './[id]/DashboardRoleCreateModal';

export default function DashboardRoleList() {
  const { trpc } = useTrpc();
  // pagination
  const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 1));
  const [perPage, setPerPage] = useQueryParam(
    'perPage',
    withDefault(NumberParam, 10),
  );
  // create role
  const [showRoleCreate, setShowRoleCreate] = useState(false);
  // get roles
  const roleList = trpc.roleRouter.findAll.useQuery({
    page,
    perPage,
  });
  // remove role
  const roleRemove = trpc.roleRouter.remove.useMutation();
  // bulk delete functionality
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleRoleSelection = (roleId: string) => {
    setSelectedIds((prevSelectedIds: string[]) =>
      prevSelectedIds.includes(roleId)
        ? prevSelectedIds.filter((id: string) => id !== roleId)
        : [...prevSelectedIds, roleId],
    );
  };

  return (
    <>
      {/* Table Section */}
      <div className="">
        {/* Card */}
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden  rounded-xl border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
                {/* Header */}
                <div className="grid gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-700 md:flex md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Roles
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add roles, edit and more.
                    </p>
                  </div>
                  <div>
                    <div className="inline-flex gap-x-2">
                      {selectedIds?.length > 0 && (
                        <a
                          className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          href="#"
                          onClick={async () => {
                            const c = confirm(
                              'Are you sure you want to remove them?',
                            );
                            if (c && selectedIds) {
                              await roleRemove.mutateAsync({
                                id: selectedIds,
                              });
                              setSelectedIds([]);
                              toast.success('Removed');
                              roleList.refetch();
                            }
                          }}
                        >
                          Remove
                        </a>
                      )}
                      <Link
                        href="#"
                        onClick={() => {
                          setShowRoleCreate(true);
                        }}
                        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        data-hs-overlay="#hs-static-backdrop-modal"
                      >
                        <svg
                          className="size-3 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M2.63452 7.50001L13.6345 7.5M8.13452 13V2"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                          />
                        </svg>
                        Add role
                      </Link>
                    </div>
                  </div>
                </div>
                {/* End Header */}
                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="py-3 ps-6">
                        <label
                          htmlFor="hs-at-with-checkboxes-main"
                          className="flex"
                        >
                          <input
                            type="checkbox"
                            checked={
                              selectedIds.length ===
                              roleList?.data?.records?.length
                            }
                            onChange={(event: any) => {
                              if (roleList?.data) {
                                if (event.target.checked) {
                                  // Select all role IDs
                                  setSelectedIds(
                                    roleList?.data?.records?.map(
                                      (role) => role.id,
                                    ),
                                  );
                                } else {
                                  // Clear selection
                                  setSelectedIds([]);
                                }
                              }
                            }}
                            className="shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-600 dark:bg-slate-900 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                            id="hs-at-with-checkboxes-main"
                          />
                          <span className="sr-only">Checkbox</span>
                        </label>
                      </th>
                      <th scope="col">
                        <div className="flex gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                            Role
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-end" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {roleList?.data?.records?.map((role) => (
                      <tr key={role.id}>
                        <td className="size-px whitespace-nowrap">
                          <div className="py-3 ps-6">
                            <label
                              htmlFor="hs-at-with-checkboxes-1"
                              className="flex"
                            >
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(role.id)}
                                onChange={() => toggleRoleSelection(role.id)}
                                className="shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-600 dark:bg-slate-900 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="py-3 pe-6 ps-6 lg:ps-3 xl:ps-0">
                            <div className="flex items-center gap-x-3">
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                                  {role.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <Link
                              className="inline-flex items-center gap-x-1 text-sm font-medium text-blue-600 decoration-2 hover:underline dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                              href={`/dashboard/roles/${role.id}`}
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* End Table */}
                {/* Footer */}
                <div className="grid gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700 md:flex md:items-center md:justify-between">
                  <div className="flex items-center justify-center gap-2">
                    <p>
                      <select
                        onChange={(event) => {
                          if (event) {
                            setPerPage(+event.target.value);
                          }
                        }}
                        className="block w-full rounded-lg border-gray-200 px-3 py-2 pe-9 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600"
                      >
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </p>
                    <p>per page</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing{' '}
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {(page - 1) * perPage + 1} ~{' '}
                        {(page - 1) * perPage +
                          1 +
                          (roleList?.data?.records?.length || 0) -
                          1}{' '}
                      </span>
                      out of{' '}
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {roleList?.data?.total}
                      </span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <div className="inline-flex gap-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPage(page === 1 ? 1 : page - 1);
                        }}
                        disabled={page === 1 ? true : false}
                        className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      >
                        <svg
                          className="size-4 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        Prev
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPage(page + 1);
                        }}
                        disabled={
                          page === roleList?.data?.lastPage ? true : false
                        }
                        className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      >
                        Next
                        <svg
                          className="size-4 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Footer */}
              </div>
            </div>
          </div>
        </div>
        {/* End Card */}
      </div>
      {/* End Table Section */}
      {showRoleCreate && (
        <DashboardRoleCreateModal
          onClose={() => {
            setShowRoleCreate(false);
            roleList.refetch();
          }}
        />
      )}
    </>
  );
}
