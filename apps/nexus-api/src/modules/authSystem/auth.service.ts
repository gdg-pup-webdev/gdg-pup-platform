import { supabase } from "@/lib/supabase.js";
import { BadRequestError } from "@/presentation/errors/HttpError.js";
import { AuthError } from "@supabase/supabase-js";
import { memberService } from "../memberSystem/member.service.js";
import { userRepositoryInstance } from "../userSystem/users/user.repository.js";

export class AuthService {
  constructor(private readonly supabaseClient = supabase) {}

  async verifyEmail(token_hash: string, type: any) {
    const { data, error } = await this.supabaseClient.auth.verifyOtp({
      token_hash,
      type,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    if (!data.user || !data.session) {
      throw new BadRequestError(
        "Verification failed: No user or session returned.",
      );
    }

    const userId = data.user.id;
    // Database trigger 'on_new_user' handles creation of:
    // - public.user
    // - public.wallet
    // - public.user_profile
    // - Assignment of 'default' role

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  }

  async signUp(
    email: string,
    password: string,
    display_name?: string,
  ): Promise<any> {
    // 1. Check if email exists in gdg_members table via MemberService
    const member = await memberService.checkMemberByEmail(email);
    if (!member) {
      throw new BadRequestError(
        "Access denied: Email is not a registered GDG member.",
      );
    }

    // 2. Check if user already has an account in the system
    const existingUser = await userRepositoryInstance.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Account already exists with this email.");
    }

    const { data, error } = await this.supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: display_name,
        },
      },
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  }

  async signIn(email: string, password: string): Promise<any> {
    // Check if email exists in gdg_members table via MemberService
    const member = await memberService.checkMemberByEmail(email);
    if (!member) {
      throw new BadRequestError(
        "Access denied: Email is not a registered GDG member.",
      );
    }

    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  }

  async signInWithOAuth(provider: "google", redirectUrl?: string) {
    const { data, error } = await this.supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl || process.env.NEXT_PUBLIC_SITE_URL,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      url: data.url,
    };
  }

  async exchangeCode(payload: {
    code?: string;
    access_token?: string;
    refresh_token?: string;
  }) {
    if (payload.code) {
      const { data, error } =
        await this.supabaseClient.auth.exchangeCodeForSession(payload.code);

      if (error) {
        throw new BadRequestError(error.message);
      }

      if (data.user?.email) {
        const member = await memberService.checkMemberByEmail(data.user.email);
        if (!member) {
          if (data.session?.access_token) {
            await this.signOut(data.session.access_token);
            // Critical: Delete the user from auth system to prevent zombie account
            if (data.user.id) {
              await this.supabaseClient.auth.admin.deleteUser(data.user.id);
            }
          }
          throw new BadRequestError(
            "Access denied: Email is not a registered GDG member.",
          );
        }
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } else if (payload.access_token) {
      // Validate existing token (Implicit Flow handling)
      const { data: userData, error } = await this.supabaseClient.auth.getUser(
        payload.access_token,
      );

      if (error) {
        throw new BadRequestError("Invalid access token: " + error.message);
      }

      if (userData.user?.email) {
        const member = await memberService.checkMemberByEmail(
          userData.user.email,
        );
        if (!member) {
          // Revoke the token if member check fails
          await this.signOut(payload.access_token);
          // Critical: Delete the user from auth system to prevent zombie account
          if (userData.user.id) {
            await this.supabaseClient.auth.admin.deleteUser(userData.user.id);
          }
          throw new BadRequestError(
            "Access denied: Email is not a registered GDG member.",
          );
        }
      }

      return {
        success: true,
        user: userData.user,
        session: {
          access_token: payload.access_token,
          refresh_token: payload.refresh_token,
          user: userData.user,
        },
      };
    } else {
      throw new BadRequestError("Missing authorization code or access token.");
    }
  }

  async getUser(token: string) {
    const { data, error } = await this.supabaseClient.auth.getUser(token);

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      success: true,
      user: data.user,
    };
  }

  async signOut(token: string) {
    const { error } = await this.supabaseClient.auth.admin.signOut(token);

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      success: true,
      message: "Signed out successfully",
    };
  }
}

export const authService = new AuthService();
