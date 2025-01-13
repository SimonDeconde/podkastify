// you can import this from any of the apps
// eg; import { SomeInterface } from '@shared/interfaces';
import { PodcastEntry, Role, User } from "@prisma/client";

export interface UserById extends User {
  roles?: Role[];
}

export const PODCASTENTRY_PRISMA_INCLUDES = {
  user: true,
};

export const USER_PRISMA_INCLUDES = {
  user: {
    omit: {
      password: true,
    },
  },
};

export enum UserStatus {
  active,
  inactive,
}

export enum Roles {
  Admin = "Admin",
  User = "User",
}

export interface PodcastEntryById extends PodcastEntry {
  user: User;
}

export interface IDictionary<TValue> {
  [id: string]: TValue;
}

export interface ApiOperationStatus {
  status: ApiOperationOutcome;
}

export enum ApiOperationOutcome {
  Success = "Success",
  Error = "Error",
}
