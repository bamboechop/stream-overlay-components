import axios from 'axios';
import type { Badges, SubMethod } from 'tmi.js';
import { getEmoteAsUrl, parseEmotesInMessage } from 'tmi-utils';

export async function getUserIdByUserName(username: string): Promise<string | undefined> {
  return (await axios.get(`https://api.twitch.tv/helix/users?login=${username}`))?.data?.data?.[0]?.id;
}

// TODO set date of store and reload image after a certain time
export async function getUserImageByUserId(userId: string): Promise<string> {
  const cachedImages: string | { [userId: string]: string } | null = window.sessionStorage.getItem('user-avatars');
  const storedImages: { [userId: string]: string } = cachedImages ? JSON.parse(cachedImages) : {};

  let userImage = storedImages?.[userId];
  if (!userImage) {
    const response = await axios.get(`https://api.twitch.tv/helix/users?id=${userId}`);
    storedImages[userId] = response.data?.data?.[0]?.profile_image_url ?? undefined;
    if (storedImages[userId]) {
      userImage = storedImages[userId];
      window.sessionStorage.setItem('user-avatars', JSON.stringify(storedImages));
    }
  }
  return userImage ?? 'https://picsum.photos/40';
}

export function parseMessage(emotes: { [emoteid: string]: string[] } | undefined, text: string) {
  const messageParts: Record<string, string | undefined>[] = [];
  for (const messagePart of parseEmotesInMessage(emotes as Record<string, string[]>, text)) {
    messageParts.push({
      raw: messagePart.raw,
      type: messagePart.type,
      value: messagePart.type === 'emote' ? getEmoteAsUrl(messagePart.value) : messagePart.value,
    });
  }
  return messageParts;
}

export function parseUserBadges(
  userBadges: Badges,
  availableBadges: Record<string, { description: string; id: string; imageUrl: string; title: string }[]>,
): { description: string; id: string; imageUrl: string; title: string }[] {
  const badges: { description: string; id: string; imageUrl: string; title: string }[] = [];
  for (const [key, value] of Object.entries(userBadges)) {
    const badge = availableBadges[key].find(badge => badge.id === value);
    if (badge) {
      badges.push(badge);
    }
  }
  return badges;
}

export function parsePlan(plan?: SubMethod): number | 'Prime' | undefined {
  if (!plan || plan === 'Prime') {
    return plan;
  }
  return Number.parseInt(plan.substring(0, 1), 10);
}
