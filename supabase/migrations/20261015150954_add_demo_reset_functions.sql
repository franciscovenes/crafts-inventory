create schema if not exists private;

-- RESET SAMPLE DATA

create or replace function private.reset_demo_data()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    truncate table
        public.item_colors,
        public.items,
        public.models,
        public.types,
        public.artisans,
        public.conditions,
        public.states,
        public.colors
    restart identity cascade;

    insert into public.types (name)
    values
        ('Ring'),
        ('Bracelet'),
        ('Necklace'),
        ('Purse'),
        ('Headband');

    insert into public.states (name)
    values
        ('In Stock'),
        ('In production'),
        ('Sold'),
        ('Being restored');

    insert into public.conditions (name)
    values
        ('Good'),
        ('Restoration required');

    insert into public.artisans (name)
    values
        ('Emma Carter'),
        ('James Walker'),
        ('Olivia Bennett'),
        ('Daniel Brooks'),
        ('Sophia Reed');

    insert into public.models (name)
    values
        ('Tuscan Sunlight'),
        ('Andean Forest'),
        ('Ocean Whisper'),
        ('Desert Bloom'),
        ('Midnight Garden');

    insert into public.colors (name, hex_code)
    values
        ('Gold', '#D4AF37'),
        ('Silver', '#C0C0C0'),
        ('Copper', '#B87333'),
        ('Black', '#000000'),
        ('White', '#FFFFFF'),
        ('Blue', '#0000FF'),
        ('Green', '#008000'),
        ('Red', '#FF0000'),
        ('Purple', '#800080'),
        ('Turquoise', '#40E0D0');

    insert into public.items (
        model_id,
        type_id,
        artisan_id,
        condition_id,
        state_id,
        price,
        length_cm,
        width_cm,
        production_hours,
        location,
        created_at
    )
    values
        (1, 1, 3, 1, 1, 450.00, 2.20, 2.00, 14.50, 'Main workshop', '2026-01-12 09:30:00+00'),
        (2, 2, 1, 1, 1, 780.00, 18.50, 1.50, 22.75, 'London gallery', '2026-02-03 14:15:00+00'),
        (3, 3, 4, 1, 3, 1250.00, 45.00, 3.00, 36.00, null, '2026-02-28 11:00:00+00'),
        (4, 4, 2, 2, 4, 320.00, 25.00, 12.00, 18.50, 'Restoration studio', '2026-03-19 16:45:00+00'),
        (5, 5, 5, 1, 2, 980.00, 30.00, 8.00, 28.25, null, '2026-04-07 10:20:00+00'),
        (1, 2, 2, 1, 1, 560.00, 20.00, 1.20, 17.00, 'Main workshop', '2026-04-25 13:30:00+00'),
        (2, 1, 5, 1, 3, 1500.00, 2.80, 2.50, 42.50, null, '2026-05-11 09:45:00+00'),
        (3, 4, 3, 2, 4, 275.00, 15.00, 10.00, 7.25, 'Restoration studio', '2026-05-26 15:10:00+00'),
        (4, 3, 1, 1, 1, 2100.00, 50.00, 4.00, 65.00, 'Paris showroom', '2026-06-02 12:00:00+00'),
        (5, 2, 4, 1, 2, 890.00, 19.00, 1.80, 31.50, null, '2026-06-18 17:25:00+00'),
        (2, 5, 3, 1, 1, 430.00, 12.00, 5.00, 13.75, 'Main workshop', '2026-06-30 08:40:00+00'),
        (3, 1, 5, 2, 4, 670.00, 3.00, 2.60, 19.00, 'Restoration studio', '2026-07-05 14:50:00+00'),
        (4, 2, 2, 1, 1, 1350.00, 21.00, 1.40, 38.25, 'London gallery', '2026-07-12 10:05:00+00'),
        (1, 4, 4, 1, 2, 760.00, 28.00, 11.00, 24.00, null, '2026-07-18 16:30:00+00'),
        (5, 3, 1, 2, 3, 3200.00, 55.00, 5.00, 90.50, null, '2026-07-22 11:15:00+00');

    insert into public.item_colors (item_id, color_id)
    values
        (1, 1), (1, 2),
        (2, 2), (2, 7),
        (3, 6), (3, 10),
        (4, 3), (4, 8),
        (5, 4), (5, 9),
        (6, 1), (6, 7), (6, 10),
        (7, 2), (7, 4),
        (8, 5), (8, 6),
        (9, 1), (9, 3), (9, 8),
        (10, 2), (10, 10),
        (11, 7), (11, 9),
        (12, 4), (12, 8),
        (13, 1), (13, 2),
        (14, 5), (14, 6), (14, 7),
        (15, 3), (15, 9);
end;
$$;

-- RESET GUEST ACCOUNT
create or replace function private.reset_demo_guest(
    p_guest_id uuid,
    p_password text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    -- Recover password
    update auth.users
    set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
        updated_at = now()
    where id = p_guest_id;

    if not found then
        raise exception 'Guest user % not found', p_guest_id;
    end if;

    -- Logout everyone using the guest account
    delete from auth.sessions
    where user_id = p_guest_id;

    -- Make sure the guest profile is still active and maintains admin role
    update public.profiles
    set active = true,
        role = 'admin'
    where id = p_guest_id;
end;
$$;

-- Revoke all from calling the function
revoke all on function private.reset_demo_data() from public, anon, authenticated;
revoke all on function private.reset_demo_guest(uuid, text) from public, anon, authenticated;

-- Run the lines below on the hosted project sql editor to set the cron job's schedule

/* select cron.schedule(
    'reset-demo',
    '0 3 * * *',
    $cron$
    select private.reset_demo_data(),
    select private.reset_demo_guest('<GUEST_UUID>', '<PUBLISHED_PASSWORD>');
    $cron$
) */

-- To stop the job: 
-- select cron.unschedule('reset-demo');

-- To see details, ordered from most recent job
-- select * from cron.job_run_details order by start_time desc;

