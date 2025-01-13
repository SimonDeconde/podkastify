'use client';

import { AppRouter } from '@server/trpc/trpc.router'; // Adjust the import path as necessary
import { transformer } from '@shared/transformer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CreateTRPCClientOptions,
  createTRPCProxyClient,
  createTRPCReact,
  httpBatchLink,
  inferReactQueryProcedureOptions,
} from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import Cookies from 'js-cookie';
import React, { ReactNode, createContext, useContext, useState } from 'react';

const trpc = createTRPCReact<AppRouter>();
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const trpcUrl = process.env.NEXT_PUBLIC_TRPC_URL;

if (trpcUrl === undefined) {
  throw new Error('NEXT_PUBLIC_TRPC_URL env var is not defined');
}

const jwtAccessToken = Cookies.get('jwtAccessToken');
const httpBatchLinkOptions = {
  url: trpcUrl,
  transformer,
  headers: jwtAccessToken
    ? {
        Authorization: `Bearer ${jwtAccessToken}`,
      }
    : undefined,
};
const trpcClientOpts: CreateTRPCClientOptions<AppRouter> = {
  links: [httpBatchLink(httpBatchLinkOptions)],
  transformer,
};

const trpcReactClient = trpc.createClient(trpcClientOpts);
const trpcAsync = createTRPCProxyClient<AppRouter>(trpcClientOpts);

interface TrpcContextState {
  trpc: typeof trpc;
  trpcAsync: typeof trpcAsync;
}

// Context will now directly store the trpc client
const TrpcContext = createContext<TrpcContextState>({
  trpc,
  trpcAsync,
});
export const TrpcProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpcReactClient);
  return (
    <TrpcContext.Provider
      value={{
        trpc,
        trpcAsync: trpcAsync,
      }}
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </TrpcContext.Provider>
  );
};
export const useTrpc = () => {
  const context = useContext(TrpcContext);
  if (context === undefined) {
    throw new Error('useTrpc must be used within a TrpcProvider');
  }
  return context;
};
