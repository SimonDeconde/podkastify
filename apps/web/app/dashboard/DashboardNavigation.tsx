'use client';

import { HomeIcon } from '@heroicons/react/24/outline';
import { RoutePath } from '@shared/route-path';
import { Breadcrumb } from '@web/components/Breadcrumb';

export const DashboardNavigation = () => {
  const elements = [
    { label: 'Dashboard', href: RoutePath.DASHBOARD, icon: <HomeIcon /> },
  ];

  return (
    <div className="my-4">
      <Breadcrumb elements={elements} />
    </div>
  );
};
