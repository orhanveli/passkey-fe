/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser";
import { UserProfile } from "./api";

export interface PasskeyRegisterStartResponse {
  options: PublicKeyCredentialCreationOptionsJSON;
}

export interface PasskeyRegisterFinishRequest
  extends RegistrationResponseJSON {}

export interface PasskeyRegisterFinishResponse {
  verified: boolean;
  access_token: string;
  user: UserProfile;
}

export interface PasskeyLoginStartRequest {
  username: string;
}

export interface PasskeyLoginStartResponse {
  options: PublicKeyCredentialRequestOptionsJSON;
}

export interface PasskeyLoginFinishRequest {
  username: string;
  options: AuthenticationResponseJSON;
}

export interface PasskeyLoginFinishResponse {
  verified: boolean;
  access_token: string;
  user: UserProfile;
}
