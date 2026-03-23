import { createFileRoute } from "@tanstack/react-router";
import ProfileLogs from "@/features/profiles/logs";
import { ProfilesProvider } from "@/features/profiles/components/profiles-provider";

export const Route = createFileRoute("/_authenticated/profiles/logs/")({
  component: () => (
    <ProfilesProvider>
      <ProfileLogs />
    </ProfilesProvider>
  ),
});