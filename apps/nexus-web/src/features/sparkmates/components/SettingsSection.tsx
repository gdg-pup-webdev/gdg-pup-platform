import { AccountSettingsSection } from "./AccountSettingsSection";
import { Text } from "@packages/spark-ui";

export function SettingsSection() {
  return (
    <div className="min-h-screen bg-[#010B1D] px-4 sm:px-6 pb-24 pt-32 sm:pt-40">
      <div className="max-w-4xl mx-auto">
        <Text variant="heading-3" weight="bold" gradient="white-blue" className="mb-2">
          Account Settings
        </Text>
        <p className="text-[#C1C7CD] mb-8 border-b border-white/10 pb-6 text-sm sm:text-base">
          Manage your personal information, security preferences, and Sparkmates visibility.
        </p>
        <AccountSettingsSection />
      </div>
    </div>
  );
}
