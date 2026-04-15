import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import CurrencyForm from "../features/settings/components/CurrencyForm.jsx";
import ProfileForm from "../features/settings/components/ProfileForm.jsx";
import { settingsService } from "../features/settings/settings.service.js";
import { useAuth } from "../hooks/useAuth.js";

const SettingsPage = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await settingsService.getProfile();
        setProfile(data);
        updateUser(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileUpdate = async (payload) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedUser = await settingsService.updateProfile(payload);
      setProfile(updatedUser);
      updateUser(updatedUser);
      setMessage("Profile updated successfully.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCurrencyUpdate = async (payload) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedUser = await settingsService.updateCurrency(payload);
      setProfile(updatedUser);
      updateUser(updatedUser);
      setMessage("Currency updated successfully.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Update your personal details and choose the currency used across the app."
      />

      {message ? <div className="message-banner success">{message}</div> : null}
      {error ? <div className="message-banner error">{error}</div> : null}

      <div className="grid-two">
        <SectionCard title="Profile" description="Keep your name and email up to date.">
          {isLoading ? (
            <p className="muted-text">Loading profile...</p>
          ) : (
            <ProfileForm user={profile} onSubmit={handleProfileUpdate} isSubmitting={isSaving} />
          )}
        </SectionCard>

        <SectionCard
          title="Currency"
          description="This currency will be used for dashboard cards and formatted values."
        >
          {isLoading ? (
            <p className="muted-text">Loading currency settings...</p>
          ) : (
            <CurrencyForm
              currentCurrency={profile?.currency}
              onSubmit={handleCurrencyUpdate}
              isSubmitting={isSaving}
            />
          )}
        </SectionCard>
      </div>
    </>
  );
};

export default SettingsPage;
