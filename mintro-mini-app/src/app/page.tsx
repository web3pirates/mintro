import { Page } from "@/components/PageLayout";
import { AuthButton } from "../components/AuthButton";
import { AuthStatus } from "../components/AuthStatus";
import { MintroBranding } from "../components/MintroBranding";
import { DebugInfo } from "../components/DebugInfo";

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col gap-8 py-8">
        {/* Mintro Branding and Timeline */}
        <MintroBranding />

        {/* Authentication Section */}
        <div className="max-w-2xl mx-auto w-full space-y-6">
          <AuthStatus />
          <div className="flex justify-center">
            <AuthButton />
          </div>
        </div>

        {/* Debug Information - Always at the bottom */}
        <DebugInfo />
      </Page.Main>
    </Page>
  );
}
