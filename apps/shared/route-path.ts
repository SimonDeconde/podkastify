/**
 * Enumerate significant route paths.
 */
export enum RoutePath {
  ACCOUNT = "/account",
  DASHBOARD = "/dashboard",
  VERIFY_EMAIL = "/verify-email",
  HOME = "/",
  LOGIN = "/login",
  LOGIN_PASSWORD = "/login/password",
  FORGOT_PASSWORD = "/forgot-password",
  MAGIC_LINK = "/magic-link?token=[token]&next=[next]",
  LOGOUT = "/logout",
  SIGNUP = "/signup",
  COMMUNITY = "/communities/[ticker]",
  COMMUNITY_NEW = "/communities/new",
  EVENT = "/events/[id]",
  NEW_COMMUNITY_EVENT = "/communities/[ticker]/new-event",
  INVITATION = "/invitations/[id]",
}
