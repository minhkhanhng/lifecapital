-- Life Capital v0.4.0 · Đồng bộ giữa các thiết bị
-- Chạy một lần trong Supabase → SQL Editor → New query → dán toàn bộ → Run.
-- Chạy lại nhiều lần cũng được: mọi lệnh đều kiểm tra trước khi tạo.
--
-- Thiết kế: mỗi tài khoản có đúng một dòng dữ liệu (lc_state.data, dạng JSON giống dữ liệu trong trình duyệt)
-- kèm số phiên bản rev. App không được ghi thẳng vào bảng; mọi lần ghi đi qua hàm lc_push, hàm này chỉ nhận
-- khi rev app gửi lên khớp rev trên máy chủ (máy khác chưa ghi chen vào). Lệch thì app tải bản mới, gộp rồi gửi lại.
-- Mỗi lần ghi, bản cũ được giữ lại trong lc_state_hist (30 bản gần nhất) để cứu dữ liệu khi cần.

-- 1. Bảng dữ liệu: một dòng mỗi tài khoản
create table if not exists public.lc_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  rev        bigint      not null default 1,
  data       jsonb       not null,
  device     text,
  updated_at timestamptz not null default now()
);

-- 2. Bảng báo hiệu nhỏ để các máy khác biết có bản mới (không chứa dữ liệu, chỉ số phiên bản)
create table if not exists public.lc_ping (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  rev        bigint      not null,
  device     text,
  updated_at timestamptz not null default now()
);

-- 3. Lịch sử: 30 bản trước đó của mỗi tài khoản
create table if not exists public.lc_state_hist (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  rev        bigint      not null,
  data       jsonb       not null,
  device     text,
  saved_at   timestamptz not null default now(),
  primary key (user_id, rev)
);

-- 4. Quy tắc bảo mật: mỗi người chỉ đọc được dòng của chính mình; không ai ghi thẳng được
alter table public.lc_state      enable row level security;
alter table public.lc_ping       enable row level security;
alter table public.lc_state_hist enable row level security;

drop policy if exists "lc_state: đọc dòng của mình" on public.lc_state;
create policy "lc_state: đọc dòng của mình" on public.lc_state
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "lc_ping: đọc dòng của mình" on public.lc_ping;
create policy "lc_ping: đọc dòng của mình" on public.lc_ping
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "lc_state_hist: đọc lịch sử của mình" on public.lc_state_hist;
create policy "lc_state_hist: đọc lịch sử của mình" on public.lc_state_hist
  for select to authenticated using ((select auth.uid()) = user_id);

revoke all on public.lc_state, public.lc_ping, public.lc_state_hist from anon;
revoke insert, update, delete on public.lc_state, public.lc_ping, public.lc_state_hist from authenticated;
grant select on public.lc_state, public.lc_ping, public.lc_state_hist to authenticated;

-- 5. Ghi dữ liệu: chỉ nhận khi p_base khớp rev hiện tại (p_base = 0: tài khoản chưa có dữ liệu).
--    Trả về rev mới; trả về -1 nếu máy khác vừa ghi trước (app sẽ tải về, gộp rồi gửi lại).
create or replace function public.lc_push(p_base bigint, p_data jsonb, p_device text default null)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid     uuid := auth.uid();
  old_row public.lc_state%rowtype;
  new_rev bigint;
begin
  if uid is null then
    raise exception 'Chưa đăng nhập' using errcode = '28000';
  end if;
  if jsonb_typeof(p_data) <> 'object' or not (p_data ? 'ev') or not (p_data ? 'caps') then
    raise exception 'Dữ liệu không hợp lệ' using errcode = '22023';
  end if;
  if octet_length(p_data::text) > 5 * 1024 * 1024 then
    raise exception 'Dữ liệu quá lớn (trên 5 MB)' using errcode = '22023';
  end if;
  p_device := left(p_device, 40);

  if p_base = 0 then
    insert into public.lc_state (user_id, rev, data, device)
    values (uid, 1, p_data, p_device)
    on conflict (user_id) do nothing;
    if not found then
      return -1;
    end if;
    new_rev := 1;
  else
    select * into old_row from public.lc_state where user_id = uid and rev = p_base for update;
    if not found then
      return -1;
    end if;
    insert into public.lc_state_hist (user_id, rev, data, device, saved_at)
    values (uid, old_row.rev, old_row.data, old_row.device, old_row.updated_at)
    on conflict (user_id, rev) do nothing;
    delete from public.lc_state_hist where user_id = uid and rev <= old_row.rev - 30;
    update public.lc_state
       set rev = rev + 1, data = p_data, device = p_device, updated_at = now()
     where user_id = uid
    returning rev into new_rev;
  end if;

  insert into public.lc_ping (user_id, rev, device, updated_at)
  values (uid, new_rev, p_device, now())
  on conflict (user_id) do update set rev = excluded.rev, device = excluded.device, updated_at = excluded.updated_at;

  return new_rev;
end;
$$;

-- 6. Xóa tài khoản và toàn bộ dữ liệu trên máy chủ (dữ liệu trên các máy vẫn giữ nguyên)
create or replace function public.lc_delete_me()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Chưa đăng nhập' using errcode = '28000';
  end if;
  delete from auth.users where id = auth.uid(); -- các bảng lc_* xóa theo nhờ on delete cascade
end;
$$;

revoke all on function public.lc_push(bigint, jsonb, text) from public, anon;
revoke all on function public.lc_delete_me() from public, anon;
grant execute on function public.lc_push(bigint, jsonb, text) to authenticated;
grant execute on function public.lc_delete_me() to authenticated;

-- 7. Báo thời gian thực: máy khác nhận tín hiệu khi lc_ping đổi (chỉ thấy dòng của mình, theo quy tắc ở mục 4)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'lc_ping'
  ) then
    alter publication supabase_realtime add table public.lc_ping;
  end if;
end;
$$;
