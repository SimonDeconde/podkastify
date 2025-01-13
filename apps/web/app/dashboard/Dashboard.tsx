'use client';

import { Roles } from '@shared/interfaces';
import WithAuth from '@web/components/WithAuth';
import AddPodcastItem from './AddPodcastItem';
import { DashboardNavigation } from './DashboardNavigation';
import MyPodcastItems from './MyPodcastItems';

const Dashboard = () => {
  return (
    <>
      <DashboardNavigation />
      <AddPodcastItem />
      <MyPodcastItems />
    </>
  );
};

export default WithAuth(Dashboard, [Roles.User, Roles.Admin]);
