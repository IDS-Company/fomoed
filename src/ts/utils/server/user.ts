import type { SupabaseClient } from '@supabase/supabase-js';

export async function getUserByEmail(supabase: SupabaseClient, email: string): Promise<IUser> {
	const user = await supabase.from('users').select().eq('email', email).limit(1).single();

	return user.data as IUser;
}
