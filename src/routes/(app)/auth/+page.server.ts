import { error, redirect, type Actions } from '@sveltejs/kit';
import { v4 as uuidv4, validate, version } from 'uuid';

export const actions: Actions = {
	signup: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const username = formData.get('username') as string;

		const { error, data } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.protocol}//${url.host}`
			}
		});

		const user = data.user?.id;

		if (error) {
			console.error(error);
			return {
				error: error.message,
				action: 'signup',
				success: false
			};
		} else {
			/**
			 * Initialize the user object with an empty subscription body
			 */
			const { data: create_user_data, error: create_user_error } = await supabase
				.from('users')
				.insert([
					{
						email,
						username,
						user_id: user
					} as Omit<IUser, 'id' | 'updated_at' | 'created_at' | 'has_valid_sub'>
				])
				.select();

			if (create_user_error) {
				// The error occured, so we need to try to create it any other time the user tries to login
				console.error(create_user_error);

				return {
					error: create_user_error.message,
					action: 'signup',
					success: false
				};
			}

			return redirect(303, '/auth/sent/create-account?email=' + email);
		}
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		console.log(email, password);

		const { error: sign_in_error, data } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (sign_in_error) {
			console.error('Login Error: ', sign_in_error);

			return {
				success: false,
				action: 'login',
				error: sign_in_error.message
			};
		} else {
			const { data: users, error: user_error } = await supabase
				.from('users')
				.select()
				.eq('email', email);

			if (user_error) {
				return error(+user_error.code, {
					message: user_error.message
				});
			}

			if (!users?.[0]) {
				// create the user
				const { data: create_user_data, error: create_user_error } = await supabase
					.from('users')
					.insert([
						{
							email,
							username: email?.split('@')[0],
							user_id: data.user.id
						} as Omit<IUser, 'id' | 'updated_at' | 'created_at' | 'has_valid_sub'>
					])
					.select();
			}

			return redirect(303, '/');
		}
	},
	forgot: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		await supabase.auth.resetPasswordForEmail(email, {
			// This uuid doesn't mean anything, just to throw off hackers. Basically, any authenticated user can reset their password, so this is the 'activator'
			redirectTo: `${url.protocol}//${url.host}/auth?uid=${uuidv4()}`
		});

		return redirect(303, '/auth/sent/password-reset?email=' + email);
	},
	update_password: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const new_password = formData.get('password') as string;

		const uid = url.searchParams.get('uid');

		if (!uid) {
			return { error: 'Invalid Details', action: 'update_password', success: false };
		}

		if (validate(uid)) {
			if (version(uid) !== 4) {
				return { erorr: 'Invalid Credentials', action: 'update_password', success: false };
			}
		}

		await supabase.auth.updateUser({ password: new_password });

		return { success: true, action: 'update_password', error: null };
	}
};
