import type { IUser, IUserInsert } from '$lib/local';
import type { SupabaseClient, User } from '@supabase/supabase-js';

export async function getUserByEmail(
	supabase: SupabaseClient,
	email: string
): Promise<IUser | null> {
	const user = await supabase.from('users').select().eq('email', email).limit(1).single();

	return user.data;
}

export async function createUserFromOAuthIfNotExists(
	supabase: SupabaseClient,
	user: User
): Promise<void> {
	if (!user.email) {
		throw new Error('User does not have an email address');
	}

	const existingUser = await getUserByEmail(supabase, user.email);

	if (existingUser) {
		return;
	}

	const newUserData: IUserInsert = {
		email: user.email,
		username: user.email?.split('@')[0],
		user_id: user.id
	};

	const newUser = await supabase.from('users').insert(newUserData);

	if (newUser.status !== 201) {
		throw new Error('Failed to create user');
	}
}
