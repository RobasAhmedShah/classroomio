import { client } from '$lib/utils/posthog';
import { redirect } from '@sveltejs/kit';

export const load = ({ request }) => {
  client.capture({
    distinctId: request.headers.get('x-forwarded-for') || new Date().getTime().toString(),
    event: 'cal.com page visited'
  });

  redirect(307, 'https://cal.com/Learnova/demo');
};
