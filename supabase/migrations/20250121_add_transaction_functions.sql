-- Create transaction functions
create or replace function begin_transaction()
returns void
language plpgsql
security definer
as $$
begin
  -- Start a new transaction
  if not exists (select 1 from pg_prepared_xacts where gid = current_setting('request.jwt.claims')::json->>'sub') then
    execute 'prepare transaction ''' || (current_setting('request.jwt.claims')::json->>'sub') || '''';
  end if;
end;
$$;

create or replace function commit_transaction()
returns void
language plpgsql
security definer
as $$
begin
  -- Commit the current transaction
  if exists (select 1 from pg_prepared_xacts where gid = current_setting('request.jwt.claims')::json->>'sub') then
    execute 'commit prepared ''' || (current_setting('request.jwt.claims')::json->>'sub') || '''';
  end if;
end;
$$;

create or replace function rollback_transaction()
returns void
language plpgsql
security definer
as $$
begin
  -- Rollback the current transaction
  if exists (select 1 from pg_prepared_xacts where gid = current_setting('request.jwt.claims')::json->>'sub') then
    execute 'rollback prepared ''' || (current_setting('request.jwt.claims')::json->>'sub') || '''';
  end if;
end;
$$;
