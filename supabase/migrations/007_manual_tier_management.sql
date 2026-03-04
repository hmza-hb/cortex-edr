-- Function to manually upgrade user tier
create or replace function upgrade_user_tier(
    user_email text,
    new_tier text
)
returns json as $$
declare
    result json;
    valid_tiers text[] := array['vibe_coder', 'developer', 'teams', 'enterprise'];
begin
    -- Validate tier
    if new_tier not in (select unnest(valid_tiers)) then
        return json_build_object(
            'success', false,
            'error', 'Invalid tier. Must be one of: vibe_coder, developer, teams, enterprise'
        );
    end if;

    -- Update user tier
    update profiles
    set
        plan_tier = new_tier,
        updated_at = now()
    where email = user_email;

    -- Check if user was found and updated
    if found then
        return json_build_object(
            'success', true,
            'message', format('User %s upgraded to %s tier', user_email, new_tier)
        );
    else
        return json_build_object(
            'success', false,
            'error', 'User not found'
        );
    end if;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users (for admin access)
grant execute on function upgrade_user_tier(text, text) to authenticated;
