import { browserSupportsWebAuthn, platformAuthenticatorIsAvailable } from "@simplewebauthn/browser";

export async function checkPasskeySupport() {
  try {
    // Check if browser supports WebAuthn
    const webAuthnSupported = browserSupportsWebAuthn();
    if (!webAuthnSupported) {
      return {
        isSupported: false,
        reason: "Your browser doesn't support passkeys. Please use a modern browser.",
      };
    }

    // Check if platform authenticator is available
    const platformAuthenticator = await platformAuthenticatorIsAvailable();
    if (!platformAuthenticator) {
      return {
        isSupported: false,
        reason: "Your device doesn't support platform authenticator. Please use a device with biometric capabilities or security keys.",
      };
    }

    return {
      isSupported: true,
      reason: null,
    };
  } catch (error) {
    console.error("Error checking passkey support:", error);
    return {
      isSupported: false,
      reason: "Failed to check passkey support. Please try again.",
    };
  }
}
