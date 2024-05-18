"use client";
import { Children } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function GoogleCaptchaWrapper({ children }) {
  const reCaptchaKey = process?.env?.NEXT_PUBLIC_RECAPTCHA_KEY;
  console.log("re", reCaptchaKey);
  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey ?? "NOT DEFINED"}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
