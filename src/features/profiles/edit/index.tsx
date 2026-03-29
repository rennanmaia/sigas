import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ConfigDrawer } from "@/components/config-drawer";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitch } from "@/components/language-switch";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/features/profiles/components/profile-form";
import type { FormValues } from "@/features/profiles/components/profile-form";
import { Route } from "@/routes/_authenticated/profiles/edit/$id";
import { useProfilesStore } from "@/stores/profiles-store";
import { FEATURE_GROUPS } from "@/features/features/data/features";

function EditProfile() {
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();
  const { getProfileById, updateProfile, addLog } = useProfilesStore();

  const PERMISSION_LABELS = Object.fromEntries(
    FEATURE_GROUPS.flatMap((group) => group.children).map((perm) => [perm.id, perm.label]),
  );

  const profile = getProfileById(id);

  if (!profile) {
    return (
      <>
        <Header fixed>
          <div />
          <div className="ms-auto flex items-center space-x-4">
            <LanguageSwitch />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="p-6">Profile not found.</div>
        </Main>
      </>
    );
  }

  const onSubmit = (values: FormValues) => {
    const previousPermissions = profile.permissions || [];
    const newPermissions = values.permissions || [];

    const added = newPermissions.filter((perm) => !previousPermissions.includes(perm));
    const removed = previousPermissions.filter((perm) => !newPermissions.includes(perm));

    const addedLabels = added.map((perm) => PERMISSION_LABELS[perm] ?? perm);
    const removedLabels = removed.map((perm) => PERMISSION_LABELS[perm] ?? perm);

    const detailsLines: string[] = [`Perfil "${values.name}" foi atualizado.`];
    if (addedLabels.length) {
      detailsLines.push(`Funções adicionadas: ${addedLabels.join(", ")}`);
    }
    if (removedLabels.length) {
      detailsLines.push(`Funções removidas: ${removedLabels.join(", ")}`);
    }

    updateProfile(profile.id, {
      label: values.name,
      description: values.description,
      permissions: values.permissions,
    });
    addLog(
      "edição",
      profile.id,
      values.name,
      detailsLines.join("\n"),
    );
    toast.success("Profile updated");
    navigate({ to: "/profiles" });
  };

  return (
    <>
      <Header fixed>
        <div className="flex items-center gap-2">
          <Link to="/profiles" className="inline-flex items-center gap-2">
            <ArrowLeft /> Voltar
          </Link>
        </div>
        <div className="ms-auto flex items-center space-x-4">
          <LanguageSwitch />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  initialValues={profile}
                  submitLabel="Save changes"
                  onSubmit={onSubmit}
                  onCancel={() => navigate({ to: "/profiles" })}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  );
}

export default EditProfile;
