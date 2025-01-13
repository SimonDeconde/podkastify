import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Tooltip } from '@nextui-org/tooltip';
import clsx from 'clsx';
import React from 'react';

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  isImportant?: boolean;
  infoHoverText?: string;
};

export const SectionCard = (props: SectionCardProps) => {
  return (
    <Card
      className={clsx({
        'my-2': true,
        ['bg-gradient-to-tr from-[#FFB457] to-[#FF705B]']: props.isImportant,
      })}
    >
      <CardHeader className="flex justify-between gap-3">
        <p className="text-md">{props.title}</p>
        {props.infoHoverText && (
          <Tooltip content={props.infoHoverText} color="secondary">
            <InformationCircleIcon className="h-6 w-6 text-gray-400" />
          </Tooltip>
        )}
      </CardHeader>
      <Divider />
      <CardBody>{props.children}</CardBody>
    </Card>
  );
};
