import { Alert, Platform } from 'react-native';

// Cross-platform alert. Alert.alert() does nothing on web, so in the browser
// we fall back to window.alert / window.confirm.
// Usage is the same as Alert.alert(title, message, buttons).
export function showAlert(title, message, buttons = []) {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;

  // 0 or 1 button: just inform the user.
  if (buttons.length <= 1) {
    window.alert(text);
    buttons[0]?.onPress?.();
    return;
  }

  // 2+ buttons: OK runs the last (main) button, Cancel runs the "cancel"
  // button, or the first button if none is marked as cancel.
  const confirmButton = buttons[buttons.length - 1];
  const cancelButton = buttons.find((b) => b.style === 'cancel') ?? buttons[0];
  // Browser dialogs only say OK/Cancel, so explain what each one does.
  const hint = `\n\nOK = ${confirmButton.text}, Cancel = ${cancelButton.text}`;
  if (window.confirm(text + hint)) {
    confirmButton.onPress?.();
  } else {
    cancelButton.onPress?.();
  }
}
