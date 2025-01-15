import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import type { LoginRequest, LoginResponse, ApiError } from "../types/api";
import { useAuthStore } from "../stores/authStore";
import { loginWithPasskey, registerPasskey } from "../services/passkey";
import { checkPasskeySupport } from "../utils/platform";

interface LocationState {
  from: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasskeyPrompt, setShowPasskeyPrompt] = useState(false);
  const [passkeySupport, setPasskeySupport] = useState<{
    isSupported: boolean;
    reason: string | null;
  } | null>(null);

  useEffect(() => {
    async function checkSupport() {
      const support = await checkPasskeySupport();
      setPasskeySupport(support);
    }
    checkSupport();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<LoginRequest>();

  const username = watch("username");

  const handlePasskeySetup = async () => {
    if (!passkeySupport?.isSupported) {
      setError(passkeySupport?.reason || "Passkeys are not supported");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const { username } = getValues();
      const response = await registerPasskey(username, username); // Using username as email for now
      login(response.token, response.user);
      const from = (location.state as LocationState)?.from?.pathname || "/";
      navigate(from);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to setup passkey. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async () => {
    if (!username) {
      setError("Username is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post<LoginResponse, LoginRequest>(
        "/auth/login",
        { username }
      );

      if (response.passkey_enabled) {
        if (!passkeySupport?.isSupported) {
          setError(
            "Your account is configured to use passkeys, but your device doesn't support them. Please use a device that supports passkeys."
          );
          return;
        }
        await handlePasskeyLogin();
      } else {
        setShowPassword(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(
          (err as ApiError).status === 401
            ? "Invalid username"
            : "An error occurred. Please try again."
        );
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post<LoginResponse, LoginRequest>(
        "/auth/login",
        {
          ...data,
          regular_login: true,
        }
      );

      if (!response.access_token || !response.user) {
        throw new Error("Invalid response from server");
      }

      if (!response.passkey_enabled && passkeySupport?.isSupported) {
        setShowPasskeyPrompt(true);
        login(response.access_token, response.user);
      } else {
        login(response.access_token, response.user);
        const from = (location.state as LocationState)?.from?.pathname || "/";
        navigate(from);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(
          (err as ApiError).status === 401
            ? "Invalid password"
            : "An error occurred. Please try again."
        );
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    if (!passkeySupport?.isSupported) {
      setError(passkeySupport?.reason || "Passkeys are not supported");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await loginWithPasskey();
      login(response.token, response.user);
      const from = (location.state as LocationState)?.from?.pathname || "/";
      navigate(from);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to login with passkey. Please try again.");
      }
      console.error("Passkey login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showPasskeyPrompt) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Setup Passkey
          </h2>
          <p className="mt-4 text-center text-sm text-gray-600">
            Would you like to setup a passkey for faster and more secure login next time?
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <button
              onClick={handlePasskeySetup}
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Setting up..." : "Setup Passkey"}
            </button>
            <button
              onClick={() => {
                const from = (location.state as LocationState)?.from?.pathname || "/";
                navigate(from);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={handleSubmit(
            showPassword ? handlePasswordSubmit : handleUsernameSubmit
          )}
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                autoComplete="username webauthn"
                disabled={showPassword}
                {...register("username", {
                  required: "Username is required",
                })}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                  errors.username
                    ? "ring-red-300 focus:ring-red-500"
                    : "ring-gray-300 focus:ring-indigo-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                  showPassword ? "bg-gray-100" : ""
                }`}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>
          {showPassword && (
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: showPassword ? "Password is required" : false,
                  })}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.password
                      ? "ring-red-300 focus:ring-red-500"
                      : "ring-gray-300 focus:ring-indigo-600"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading
                ? "Signing in..."
                : showPassword
                ? "Sign in"
                : "Continue"}
            </button>
          </div>

          {showPassword && (
            <div className="text-sm">
              <button
                type="button"
                onClick={() => {
                  setShowPassword(false);
                  setError(null);
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                ← Back to username
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
