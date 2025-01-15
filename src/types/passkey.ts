/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser";

export interface PasskeyRegisterStartResponse {
  options: PublicKeyCredentialCreationOptionsJSON;
}

export interface PasskeyRegisterFinishRequest
  extends RegistrationResponseJSON {}

export interface PasskeyRegisterFinishResponse {
  verified: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface PasskeyLoginStartResponse {
  options: PublicKeyCredentialRequestOptionsJSON;
}

export interface PasskeyLoginFinishRequest extends AuthenticationResponseJSON {}

export interface PasskeyLoginFinishResponse {
  verified: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}
