import HTTP from "http-status-codes";
import nodemailer from "nodemailer";
import { Doctor } from "../database/entities";
import { DoneResult, signInReponse } from "../types";
import { admin, auth } from "../firebase/index";
import { codedError } from "../lib/coded-error";
const { EMAIL_PASSWORD, EMAIL_USERNAME } = require("../config");

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

  async signUp(email: string, password: string): Promise<DoneResult> {
    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await response.user!.sendEmailVerification();

      return { done: true };
    } catch (err: any) {
      throw err;
    }
  }

  async signIn(email: string, password: string): Promise<signInReponse> {
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

  async resetPasswordFirebase(email: string): Promise<DoneResult> {
    try {
      await auth.sendPasswordResetEmail(email);

      return { done: true };
    } catch (err: any) {
      throw err;
    }
  }

  async deleteUser(userId: string): Promise<DoneResult> {
    try {
      await admin.auth().deleteUser(userId);
      await Doctor.findOneAndDelete({ id: userId });

      return { done: true };
    } catch (err: any) {
      throw err;
    }
  }

  async createUser(email: string): Promise<DoneResult> {
    const tempPassword = Math.random().toString(36).slice(-8);
    let transporter = nodemailer.createTransport({
      service: "Outlook365",
      auth: {
        user: EMAIL_USERNAME, // generated ethereal user
        pass: EMAIL_PASSWORD, // generated ethereal password
      },
    });

    try {
      await admin
        .auth()
        .createUser({ email, password: tempPassword, emailVerified: true });
      await transporter.sendMail({
        from: EMAIL_USERNAME,
        to: email,
        subject: "Welcome to MedicalFiles",
        text: `Sign in with username: ${email} and password: ${tempPassword}`,
      });
      return { done: true };
    } catch (err: any) {
      throw err;
    }
  }
}
