import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { firstName, lastName, email, inquiryType, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const { data, error } = await resend.emails.send({
      from: 'hello@jocelynmaria.com',
      to: 'byjocelynmaria@gmail.com',
      replyTo: email,
      subject: `New Inquiry: ${inquiryType || 'General'} from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType || 'General'}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      res.status(400).json({ error });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Unexpected error sending email:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
