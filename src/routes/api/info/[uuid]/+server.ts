import { GetUser } from '$db/database';
import type { RequestHandler } from './$types';
import { GET as fetchWeight } from '../../weight/[uuid]/+server';
import type { UserInfo } from '$db/models/users';

export const GET: RequestHandler = async (event) => {
	const uuid = event.params.uuid.replaceAll('-', '');

	if (!uuid || uuid.length !== 32) {
		return new Response(JSON.stringify({ error: 'Not a valid UUID' }), { status: 400 });
	}

	const user = await GetUser(uuid);

	if (!user) {
		return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
	}

	if (!user.info) {
		return new Response(JSON.stringify({ error: 'User has no info' }), { status: 404 });
	}

	const info = user.info as Partial<UserInfo>;

	if (info.profiles) {
		const response = await fetchWeight(event);

		if (response.status === 200) {
			return response;
		}
	}

	return new Response(JSON.stringify(user.info));
};
