import { Card, CardHeader } from '@nextui-org/card';
import { PodcastEntryDto } from '@server/podcast-entry/entities/podcast-entry.entity';
import { formatDateTime } from '@shared/utils';
import Link from 'next/link';

type Props = {
  item: PodcastEntryDto;
};

export const PodcastItemCard = ({ item }: Props) => {
  return (
    <Card className="max-w-md">
      <CardHeader className="justify-between">
        <div className="flex items-center gap-5">
          {/* <Avatar isBordered radius="full" size="md" name={community.ticker} /> */}
          <div className="flex flex-col items-start justify-center gap-1">
            <h4 className="text-small font-semibold leading-none text-default-600">
              <Link color="foreground" href={item.downloadUrl}>
                {item.title}
                <br /> {formatDateTime(item.pubDate)}
              </Link>
            </h4>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
