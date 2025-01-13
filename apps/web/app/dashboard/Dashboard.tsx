'use client';

import { Roles } from '@shared/interfaces';
import WithAuth from '@web/components/WithAuth';
import AddPodcastItem from './AddPodcastItem';
import { DashboardNavigation } from './DashboardNavigation';
import MyItems from './MyItems';

const Dashboard = () => {
  return (
    <>
      <DashboardNavigation />
      <AddPodcastItem />
      <MyItems />
    </>
  );
};

export default WithAuth(Dashboard, [Roles.User, Roles.Admin]);
