# RLS Notes

## What is RLS?

Row Level Security (RLS) is a Postgres feature that applies policies per row so a query only returns or modifies rows allowed by policy rules.

## Why can a service/admin DB role bypass it?

Service/admin roles are privileged roles used for backend operations. They can bypass user-scoped row policies so maintenance or trusted server workloads can still run. This is why service keys must stay server-side.

## Why is DB-level authorization defense in depth?

App-level auth checks can have bugs. RLS adds a second enforcement layer in the database itself, so unauthorized reads/writes are blocked even if an API route forgets a check.

## How would `auth.uid()` map to `authorId` with Supabase Auth?

With Supabase Auth, `auth.uid()` gives the authenticated user UUID from the JWT claims. Store that same UUID in `authorId` for `Project`/`Task` rows, then compare row `authorId = auth.uid()` in policies.

## Example owner-only update policy (pseudo SQL)

```sql
alter table public.projects enable row level security;

create policy "project_owner_can_update"
on public.projects
for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());
```

Reference: Supabase Row Level Security guide.
