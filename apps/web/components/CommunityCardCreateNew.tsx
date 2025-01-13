import { PlusIcon } from '@heroicons/react/24/outline';
import { Link } from '@nextui-org/link';
import { RoutePath } from '@shared/route-path';

export const CommunityCardCreateNew = () => {
  return (
    <Link
      isBlock
      color="foreground"
      href={RoutePath.COMMUNITY_NEW}
      className="border-red flex items-center gap-2 border-dashed px-6"
    >
      <PlusIcon className="h-8 w-8" />
      <p>New community</p>
    </Link>
  );
};
