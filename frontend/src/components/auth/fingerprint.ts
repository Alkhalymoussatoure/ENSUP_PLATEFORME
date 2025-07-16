export default function getFingerprint(): string {
  const userAgent: string = navigator.userAgent;
  const screenSize: string = `${window.screen.width}x${window.screen.height}`;
  const timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language: string = navigator.language;

  const raw: string = `${userAgent}|${screenSize}|${timezone}|${language}`;
  return btoa(raw); // encodage base64
}
