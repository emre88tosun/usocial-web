export default function getInitials(str: string, maxLen = 3): string {
  const words = str.split(' ');
  const initials = words.map((word) => word[0]).join('');
  return initials.slice(0, maxLen);
}
