import { UseTRPCQueryResult } from '@trpc/react-query/dist/shared';
import { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { TrpcErrorMessage } from './TrpcErrorMessage';

interface Props {
  payload: UseTRPCQueryResult<any, any>;
  children: ReactNode;
}

/**
 * Render a loading spinner if loading prop set, otherwise render children.
 */
export const LoadingWrapper = ({ children, payload }: Props) => {
  const components: ReactNode[] = [];

  if (payload.isError) {
    components.push(<TrpcErrorMessage error={payload.error} />);
  } else {
    if (payload.isLoading) {
      components.push(<LoadingSpinner className="text-center" />);
    } else {
      components.push(children);
    }
  }

  return <div>{components.map((component) => component)}</div>;
};
