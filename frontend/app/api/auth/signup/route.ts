import SupaAuthVerifyEmail from "@/emails";
import supabaseAdmin from "@/lib/supabase/admin";

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
	const data = await request.json();
	const supabase = supabaseAdmin();

	// Create the user first
	const res = await supabase.auth.admin.generateLink({
		type: "signup",
		email: data.email,
		password: data.password,
	});

	if (res.data.user) {
		// Insert the user role
		const { error: roleError } = await supabase
			.from('user_roles')
			.insert({
				user_id: res.data.user.id,
				role: data.role
			});

		if (roleError) {
			console.error('Error setting user role:', roleError);
			return Response.json({ error: 'Failed to set user role' }, { status: 500 });
		}
	}

	if (res.data.properties?.email_otp) {
		const resendRes = await resend.emails.send({
			from: `Smart Triage <onboarding@${process.env.RESEND_DOMAIN}>`,
			to: [data.email],
			subject: "Smart Triage - Verify Email",
			react: SupaAuthVerifyEmail({
				verificationCode: res.data.properties?.email_otp,
			}),
		});
		return Response.json(resendRes);
	} else {
		return Response.json({ data: null, error: res.error });
	}
}
