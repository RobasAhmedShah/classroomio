import sendEmail from '$mail/sendEmail';
import { json } from '@sveltejs/kit';

// API to send invite to teacher
export async function POST({ request }) {
  const body = await request.json();
  const { org, email } = body;

  console.log('/POST api/email/invite', body);

  if (!org || !Object.keys(org).length || !email) {
    return json(
      { success: false, message: 'Org data and Teacher name are required' },
      { status: 400 }
    );
  }

  const { id, name, siteName } = org;

  const origin = request.headers.get('origin');
  const inviteData = JSON.stringify({
    email,
    orgId: id,
    orgSiteName: siteName
  });
  const inviteLink = `${origin}/invite/t/${encodeURIComponent(btoa(inviteData))}`;
  console.log('inviteData', inviteData);

  const emailData = [
    {
      from: { address: 'noreply@peopletalk.io' },
      to: [
        {
          email_address: {
            address: email,
            name: name
          }
        }
      ],
      subject: `Join ${name} on Learnova 😃`,
      htmlbody: `
    <p>Hey there,</p>
      <p> You have been invited to join ${name} on Learnova 🎉🎉🎉.</p>
      <div>
        <a class="button" href="${inviteLink}">Accept Invitation</a>
      </div>
    `
    }
  ];
  await sendEmail(emailData);

  return json({
    success: true,
    message: 'Email sent'
  });
}
