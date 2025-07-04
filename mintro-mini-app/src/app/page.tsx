import { Page } from "@/components/PageLayout";
import { AuthButton } from "../components/AuthButton";
import { AuthStatus } from "../components/AuthStatus";

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center gap-6">
        <AuthStatus />
        <AuthButton />
      </Page.Main>
    </Page>
  );
}
