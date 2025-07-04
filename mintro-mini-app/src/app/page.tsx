import { Page } from "@/components/PageLayout";
import { AuthButton } from "../components/AuthButton";
import { AuthStatus } from "../components/AuthStatus";
import { MintroBranding } from "../components/MintroBranding";

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col gap-8 py-8">
        {/* Mintro Branding and Timeline */}
        <MintroBranding />

        {/* Authentication Section */}
        <div className="max-w-2xl mx-auto w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Get Started
            </h2>
            <p className="text-gray-600">
              Connect your wallet to access Mintro's features
            </p>
          </div>
          <AuthStatus />
          <div className="flex justify-center">
            <AuthButton />
          </div>
        </div>
      </Page.Main>
    </Page>
  );
}
