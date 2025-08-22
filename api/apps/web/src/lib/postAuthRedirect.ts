const allowed = (p?: string) =>
  typeof p === "string" && p.startsWith("/") && !p.startsWith("//");

export function postAuthRedirect(opts: {
  redirect?: string;
  firstLoginAfterOnboarding?: boolean;
}) {
  const { redirect, firstLoginAfterOnboarding } = opts;
  if (redirect && allowed(redirect)) return redirect;
  if (firstLoginAfterOnboarding) return "/menotracker";
  return "/dashboard";
}
