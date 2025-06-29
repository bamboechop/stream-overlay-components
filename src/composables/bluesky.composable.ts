import { AtpAgent } from '@atproto/api';
import type { AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyFeedDefs } from '@atproto/api';

export type BlueskyPost =
  | { type: 'text'; text: string; author: string }
  | { type: 'image'; text: string; images: string[]; author: string }
  | { type: 'external'; text: string; external: { uri: string; title: string; description?: string; thumb?: string }; author: string };

const agent = new AtpAgent({ service: 'https://public.api.bsky.app' });

/**
 * Fetches the latest posts for a given Bluesky handle.
 * Only returns posts that are text-only, image embed, or external embed.
 * Filters out posts with unsupported embed types.
 */
export async function fetchLatestPosts(handle: string, limit: number = 5): Promise<BlueskyPost[]> {
  try {
    const response = await agent.getAuthorFeed({ actor: handle, limit });
    if (!response.success || !response.data.feed) {
      return [];
    }

    return response.data.feed
      .map((item: AppBskyFeedDefs.FeedViewPost): BlueskyPost | null => {
        const post = item.post;
        const text = typeof post.record === 'object' && post.record !== null && 'text' in post.record ? String(post.record.text) : '';
        const embed = post.embed;
        const author = post.author?.handle || '';

        if (!embed) {
          // Text-only post
          return { type: 'text', text, author };
        }

        if (
          embed.$type === 'app.bsky.embed.images#view'
          && 'images' in embed
          && Array.isArray(embed.images)
        ) {
          // Image embed post
          const images = (embed.images as AppBskyEmbedImages.ViewImage[]).map(img => img.fullsize || img.thumb).filter(Boolean);
          return { type: 'image', text, images, author };
        }

        if (
          embed.$type === 'app.bsky.embed.external#view'
          && 'external' in embed
          && typeof embed.external === 'object'
          && embed.external !== null
        ) {
          // External embed post
          const ext = embed.external as AppBskyEmbedExternal.ViewExternal;
          return {
            type: 'external',
            text,
            external: {
              uri: ext.uri,
              title: ext.title,
              description: ext.description,
              thumb: ext.thumb,
            },
            author,
          };
        }

        // Unsupported embed type: filter out
        return null;
      })
      .filter((post): post is BlueskyPost => post !== null);
  } catch (e) {
    return [];
  }
}

/**
 * Filters out posts that contain the specified text.
 * Useful for filtering out specific types of posts like "stream going offline" messages.
 */
export function filterPosts(posts: BlueskyPost[], filterText: string): BlueskyPost[] {
  return posts.filter(post => !post.text.includes(filterText));
}
