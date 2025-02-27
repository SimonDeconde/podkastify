'use client';

import { Roles } from '@shared/interfaces';
import WithAuth from '@web/components/WithAuth';
import AddPodcastItem from './AddPodcastItem';
import GetPodcastFeedUrlButton from './GetPodcastFeedUrlButton';
import MyPodcastItems from './MyPodcastItems';

const Dashboard = () => {
  return (
    <>
      <div className="space-between flex items-center gap-2  py-12">
        <div className="w-64 flex-1">
          <AddPodcastItem />
        </div>
        <div className="flex-1 text-end">
          <GetPodcastFeedUrlButton />
        </div>
      </div>

      <MyPodcastItems />
    </>
  );
};

export default WithAuth(Dashboard, [Roles.User, Roles.Admin]);
