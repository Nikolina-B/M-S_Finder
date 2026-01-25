import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/lib/db"; // your drizzle instance
import { user, account, session, verification } from "@/app/lib/db/auth-schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend"; // Importaj Resend

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL, 
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            account,
            session,
            verification
        }
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword({ user, url }, request) {
            await resend.emails.send({
                from: "My App <onboarding@resend.dev>",
                to: user.email,
                subject: "Reset your password",
                html: `
          <div>
            <h1>Reset Password</h1>
            <p>Hi ${user.name || "there"},</p>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${url}" style="background: #000; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
              Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
            <hr />
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
            });
        },
        resetPasswordTokenExpiresIn: 60 * 60, 
    },
   
    


    session: {
    expiresIn: 60 * 60 * 24,           // 1 dan (default)
    rememberMeExpiresIn: 60 * 60 * 24 * 30, // 30 dana
    updateAge: 60 * 60 * 24,           // refresh session
  },
  socialProviders: {
        google: { 
            prompt: "select_account", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

    
    plugins: [nextCookies()] 
});