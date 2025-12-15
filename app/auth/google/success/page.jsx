import { Suspense } from "react";
import GoogleSuccessClient from "../../../auth/google/success/GoogleSuccessClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleSuccessClient />
    </Suspense>
  );
}
