import { ChatSettings } from "./chat-settings";
import { SettingsDialogRouter } from "./settings-dialog-router";

export function SettingsDialog() {
  return (
    <SettingsDialogRouter>
      <ChatSettings />
    </SettingsDialogRouter>
  );
}
