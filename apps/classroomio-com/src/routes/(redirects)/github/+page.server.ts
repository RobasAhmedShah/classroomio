import { client } from '$lib/utils/posthog';
import { redirect } from '@sveltejs/kit';

export const load = async ({ request }) => {
  client.capture({
    distinctId: request.headers.get('x-forwarded-for') || new Date().getTime().toString(),
    event: 'github page visited'
  });

  redirect(307, 'https://github.com/rotimi-best/Learnova');
};
