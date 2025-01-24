import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import { api } from "../utils/api";
import type {
  PasskeyRegisterStartResponse,
  PasskeyRegisterFinishRequest,
  PasskeyRegisterFinishResponse,
  PasskeyLoginStartResponse,
  PasskeyLoginFinishRequest,
  PasskeyLoginFinishResponse,
  PasskeyLoginStartRequest,
} from "../types/passkey";

class PasskeyError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "PasskeyError";
  }
}

function handlePasskeyError(error: unknown): never {
  console.error("Passkey error:", error);

  if (error instanceof Error) {
    // Handle specific WebAuthn errors
    if (error.name === "NotAllowedError") {
      throw new PasskeyError(
        "Operation was denied. Please try again.",
        "NOT_ALLOWED"
      );
    }
    if (error.name === "SecurityError") {
      throw new PasskeyError(
        "A security error occurred. Make sure you're using a secure context (HTTPS).",
        "SECURITY_ERROR"
      );
    }
    if (error.name === "AbortError") {
      throw new PasskeyError(
        "Operation was aborted. Please try again.",
        "ABORTED"
      );
    }
    if (error.name === "InvalidStateError") {
      throw new PasskeyError(
        "The authenticator is not in a valid state. Please try again.",
        "INVALID_STATE"
      );
    }
    if (error.name === "NotSupportedError") {
      throw new PasskeyError(
        "This operation is not supported by your browser or device.",
        "NOT_SUPPORTED"
      );
    }

    throw new PasskeyError(error.message, "UNKNOWN");
  }

  throw new PasskeyError(
    "An unexpected error occurred. Please try again.",
    "UNKNOWN"
  );
}

export async function registerPasskey() {
  try {
    // Get registration options from the server
    const { options } = await api.get<PasskeyRegisterStartResponse>(
      "/api/auth/passkey/register-start"
    );

    // Pass the options to the authenticator and get the response
    const attResp = await startRegistration({
      optionsJSON: options,
      useAutoRegister: true,
    });

    // Send the response to the server to verify and get the user data
    const verificationResp = await api.post<
      PasskeyRegisterFinishResponse,
      PasskeyRegisterFinishRequest
    >("/api/auth/passkey/register-finish", attResp);

    if (!verificationResp.verified) {
      throw new PasskeyError(
        "Failed to verify passkey registration.",
        "VERIFICATION_FAILED"
      );
    }

    return verificationResp;
  } catch (error) {
    handlePasskeyError(error);
  }
}

export async function loginWithPasskey(email: string) {
  try {
    // Get authentication options from the server
    const { options } = await api.post<
      PasskeyLoginStartResponse,
      PasskeyLoginStartRequest
    >("/api/auth/passkey/login-start", { email });

    // Pass the options to the authenticator and get the response
    const authResp = await startAuthentication({
      optionsJSON: options,
      useBrowserAutofill: false,
      verifyBrowserAutofillInput: false,
    });

    // Send the response to the server to verify and get the user data
    const verificationResp = await api.post<
      PasskeyLoginFinishResponse,
      PasskeyLoginFinishRequest
    >("/api/auth/passkey/login-finish", {
      options: authResp,
      email,
    });

    if (!verificationResp.verified) {
      throw new PasskeyError(
        "Failed to verify passkey authentication.",
        "VERIFICATION_FAILED"
      );
    }

    return verificationResp;
  } catch (error) {
    handlePasskeyError(error);
  }
}
