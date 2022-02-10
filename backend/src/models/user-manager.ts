import { DoneResult } from "../types";
import { admin, auth } from "../firebase/index";
import { codedError } from "../lib/coded-error";
import HTTP from "http-status-codes";

export class UserManager {
    async changeUserPassword(
        userId: string,
        password: string
    ): Promise<DoneResult> {
        try {
            await admin.auth().updateUser(userId, {
                password,
            });
        } catch (e) {
            throw e;
        }

        return { done: true };
    }

    async signUp(email: string, password: string) {
        try {
            const response = await auth.createUserWithEmailAndPassword(
                email,
                password
            );
            await response.user!.sendEmailVerification();
        } catch (err: any) {
            throw err;
        }
    }

    async signIn(email: string, password: string) {
        try {
            const { user }: any = await auth.signInWithEmailAndPassword(
                email,
                password
            );
            if (!user) {
                throw codedError(HTTP.NOT_FOUND, "User doesn't exist");
            } else if (!user.multiFactor.user.emailVerified) {
                throw codedError(HTTP.CONFLICT, "Verify your email");
            }

            return {
                accessToken: user.multiFactor.user.accessToken,
                profile: {
                    id: user.multiFactor.user.uid,
                    email: user.multiFactor.user.email,
                },
                refreshToken: user.multiFactor.user.stsTokenManager.refreshToken,
            };
        } catch (err: any) {
            throw err.message;
        }
    }

    async resetPasswordFirebase(email: string) {
        try {
            await auth.sendPasswordResetEmail(email);
        } catch (err: any) {
            throw err;
        }
    }
}
