import { PlatformId } from '../types';

const RAPIDAPI_KEY = '496dcf8f46mshd9059097e69d059p161ab4jsn8d25751d5221';

// Instagram
const INSTAGRAM_BASE_URL = 'https://real-time-instagram-scraper-api1.p.rapidapi.com';
const INSTAGRAM_HOST = 'real-time-instagram-scraper-api1.p.rapidapi.com';

// TikTok
const TIKTOK_BASE_URL = 'https://tiktok-api23.p.rapidapi.com';
const TIKTOK_HOST = 'tiktok-api23.p.rapidapi.com';

// YouTube
const YOUTUBE_BASE_URL = 'https://youtube-scraper3.p.rapidapi.com';
const YOUTUBE_HOST = 'youtube-scraper3.p.rapidapi.com';

// Kwai
const KWAI_BASE_URL = 'https://kwai-scraper.p.rapidapi.com';
const KWAI_HOST = 'kwai-scraper.p.rapidapi.com';

export interface InstagramProfile {
    username: string;
    full_name: string;
    profile_pic_url: string;
    follower_count: number;
    following_count: number;
    media_count: number;
    is_private: boolean;
    is_verified: boolean;
}

export const fetchInstagramProfile = async (username: string): Promise<InstagramProfile> => {
    // Remove @ if present
    const cleanUsername = username.replace('@', '').trim();

    const url = `${INSTAGRAM_BASE_URL}/v1/user_info?username_or_id=${cleanUsername}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': INSTAGRAM_HOST
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.data) {
            throw new Error('Perfil não encontrado');
        }

        const user = data.data;

        return {
            username: user.username,
            full_name: user.full_name,
            profile_pic_url: `https://wsrv.nl/?url=${encodeURIComponent(user.profile_pic_url)}`,
            follower_count: user.follower_count,
            following_count: user.following_count,
            media_count: user.media_count,
            is_private: user.is_private,
            is_verified: user.is_verified
        };

    } catch (error) {
        console.error('Error fetching Instagram profile:', error);
        throw error;
    }
};

export interface InstagramPost {
    id: string;
    shortcode: string;
    display_url: string;
    caption: string;
    likes: number;
    comments: number;
    timestamp: number;
}

export const fetchInstagramPosts = async (username: string): Promise<InstagramPost[]> => {
    // Remove @ if present
    const cleanUsername = username.replace('@', '').trim();

    const url = `${INSTAGRAM_BASE_URL}/v1/user_posts?username_or_id=${cleanUsername}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': INSTAGRAM_HOST
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.data || !data.data.items) {
            // Return empty array instead of error if no posts found, to handle gracefully
            return [];
        }

        return data.data.items.slice(0, 12).map((item: any) => ({
            id: item.id,
            shortcode: item.code,
            display_url: `https://wsrv.nl/?url=${encodeURIComponent(item.image_versions2?.candidates?.[0]?.url || '')}`,
            caption: item.caption?.text || '',
            likes: item.like_count,
            comments: item.comment_count,
            timestamp: item.taken_at
        }));

    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        throw error;
    }
};

// ==================== TikTok ====================

export interface TikTokProfile {
    uniqueId: string;
    nickname: string;
    avatarUrl: string;
    followerCount: number;
    followingCount: number;
    videoCount: number;
    secUid: string; // Needed for fetching posts
    verified: boolean;
}

export const fetchTikTokProfile = async (uniqueId: string): Promise<TikTokProfile> => {
    const cleanUsername = uniqueId.replace('@', '').trim();
    const url = `${TIKTOK_BASE_URL}/api/user/info?uniqueId=${cleanUsername}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': TIKTOK_HOST
        }
    };

    try {
        console.log('[TikTok API] Fetching profile for:', cleanUsername);
        const response = await fetch(url, options);

        if (!response.ok) {
            console.error('[TikTok API] HTTP Error:', response.status, response.statusText);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('[TikTok API] Response data:', data);

        // Check various possible response structures
        if (!data) {
            console.error('[TikTok API] No data in response');
            throw new Error('Perfil não encontrado');
        }

        // Handle structure: data.userInfo.user / data.userInfo.stats
        const userInfo = data.userInfo;
        const user = userInfo?.user || data.data?.user || data.user;
        const stats = userInfo?.stats || data.data?.stats || user?.stats || {};

        if (!user) {
            console.error('[TikTok API] User data not found');
            throw new Error('Perfil não encontrado');
        }

        console.log('[TikTok API] User found:', user.uniqueId);

        return {
            uniqueId: user.uniqueId,
            nickname: user.nickname || user.uniqueId,
            avatarUrl: user.avatarLarger || user.avatarMedium || user.avatarThumb || user.avatar || '',
            followerCount: stats.followerCount || user.followerCount || 0,
            followingCount: stats.followingCount || user.followingCount || 0,
            videoCount: stats.videoCount || user.videoCount || 0,
            secUid: user.secUid || user.sec_uid || '',
            verified: user.verified || user.isVerified || false
        };
    } catch (error) {
        console.error('[TikTok API] Error fetching profile:', error);
        throw error;
    }
};

export interface TikTokPost {
    id: string;
    desc: string;
    coverUrl: string;
    playUrl: string;
    diggCount: number; // likes
    commentCount: number;
    playCount: number; // views
    createTime: number;
}

export const fetchTikTokPosts = async (secUid: string): Promise<TikTokPost[]> => {
    const url = `${TIKTOK_BASE_URL}/api/user/posts?secUid=${secUid}&count=35&cursor=0`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': TIKTOK_HOST
        }
    };

    try {
        console.log('[TikTok API] Fetching posts for secUid:', secUid);
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('[TikTok API] Posts response keys:', Object.keys(data));
        if (data.data) {
            console.log('[TikTok API] Posts response data keys:', Object.keys(data.data));
        }

        if (!data || !data.data || (!data.data.videos && !data.data.itemList)) {
            console.warn('[TikTok API] No videos found in response');

            // Check for aweme_list (another common structure)
            if (data.data && data.data.aweme_list) {
                console.log('[TikTok API] Found aweme_list, using that');
                return data.data.aweme_list.slice(0, 12).map((video: any) => ({
                    id: video.aweme_id,
                    desc: video.desc || '',
                    coverUrl: video.video?.cover?.url_list?.[0] || '',
                    playUrl: video.video?.play_addr?.url_list?.[0] || '',
                    diggCount: video.statistics?.digg_count || 0,
                    commentCount: video.statistics?.comment_count || 0,
                    playCount: video.statistics?.play_count || 0,
                    createTime: video.create_time
                }));
            }

            return [];
        }

        const videos = data.data.videos || data.data.itemList;
        console.log('[TikTok API] Found videos:', videos.length);

        return videos.slice(0, 12).map((video: any) => ({
            id: video.id || video.aweme_id,
            desc: video.desc || '',
            // Prioritize video object structure from user provided JSON
            coverUrl: video.video?.cover || video.cover || video.video?.originCover || video.video?.dynamicCover || video.video?.cover?.url_list?.[0] || '',
            playUrl: video.video?.playAddr || video.playAddr || video.video?.play_addr?.url_list?.[0] || '',
            diggCount: video.stats?.diggCount || video.diggCount || video.statistics?.digg_count || 0,
            commentCount: video.stats?.commentCount || video.commentCount || video.statistics?.comment_count || 0,
            playCount: video.stats?.playCount || video.playCount || video.statistics?.play_count || 0,
            createTime: video.createTime || video.create_time
        }));
    } catch (error) {
        console.error('Error fetching TikTok posts:', error);
        throw error;
    }
};

// ==================== YouTube ====================

export interface YouTubeChannel {
    channelId: string;
    title: string;
    thumbnailUrl: string;
    subscriberCount: string;
    videoCount: string;
    verified: boolean;
}

export const fetchYouTubeChannel = async (query: string): Promise<YouTubeChannel> => {
    const cleanQuery = query.replace('@', '').trim();

    try {
        // Step 1: Get channel ID by username
        console.log('[YouTube API] Step 1: Fetching channel ID for:', cleanQuery);
        const idUrl = `${YOUTUBE_BASE_URL}/api/v1/channel/id?username=${encodeURIComponent(cleanQuery)}`;

        const idResponse = await fetch(idUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': YOUTUBE_HOST
            }
        });

        if (!idResponse.ok) {
            throw new Error(`API Error: ${idResponse.status}`);
        }

        const idData = await idResponse.json();
        console.log('[YouTube API] ID Response:', idData);

        if (!idData || !idData.data || !idData.data.id) {
            throw new Error('Canal não encontrado');
        }

        const channelId = idData.data.id;

        // Step 2: Get full channel info using the ID
        console.log('[YouTube API] Step 2: Fetching channel info for ID:', channelId);
        const infoUrl = `${YOUTUBE_BASE_URL}/api/v1/channel/info?channel_id=${channelId}`;

        const infoResponse = await fetch(infoUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': YOUTUBE_HOST
            }
        });

        if (!infoResponse.ok) {
            throw new Error(`API Error: ${infoResponse.status}`);
        }

        const infoData = await infoResponse.json();
        console.log('[YouTube API] Info Response:', infoData);

        if (!infoData || !infoData.data || !infoData.data.channel) {
            throw new Error('Informações do canal não encontradas');
        }

        const channel = infoData.data.channel;

        return {
            channelId: channel.id,
            title: channel.title,
            thumbnailUrl: channel.avatar?.[0]?.url || '',
            subscriberCount: channel.subscriber_count || '0',
            videoCount: channel.total_videos || '0',
            verified: channel.is_verified || false
        };
    } catch (error) {
        console.error('[YouTube API] Error fetching channel:', error);
        throw error;
    }
};

export interface YouTubeVideo {
    video_id: string;
    title: string;
    description: string;
    thumbnail: string; // URL of the best quality thumbnail
    view_count: number;
    published_at: string;
    video_length: string;
}

export const fetchYouTubeVideos = async (channelId: string): Promise<YouTubeVideo[]> => {
    const url = `${YOUTUBE_BASE_URL}/api/v1/channel/videos?channel_id=${channelId}`;

    try {
        console.log('[YouTube API] Fetching videos for channel:', channelId);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': YOUTUBE_HOST
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('[YouTube API] Videos response:', data);

        if (!data || !data.data || !data.data.channel || !data.data.channel.videos) {
            console.warn('[YouTube API] No videos found in response');
            return [];
        }

        const videos = data.data.channel.videos;
        console.log('[YouTube API] Found videos:', videos.length);

        // Map to our interface, taking up to 12 videos
        return videos.slice(0, 12).map((video: any) => ({
            video_id: video.video_id,
            title: video.title,
            description: video.description,
            // Get the best quality thumbnail (last one in the array is usually highest quality)
            thumbnail: video.thumbnail?.[video.thumbnail.length - 1]?.url || video.thumbnail?.[0]?.url || '',
            view_count: video.view_count || 0,
            published_at: video.published_at || '',
            video_length: video.video_length || ''
        }));
    } catch (error) {
        console.error('[YouTube API] Error fetching videos:', error);
        throw error;
    }
};

// ==================== Kwai ====================

export interface KwaiProfile {
    username: string;
    name: string;
    avatarUrl: string;
    followerCount: number;
    followingCount: number;
    videoCount: number;
    verified: boolean;
}

export const fetchKwaiProfile = async (username: string): Promise<KwaiProfile> => {
    // Ensure username starts with @
    const cleanUsername = username.startsWith('@') ? username : `@${username}`;
    const url = `${KWAI_BASE_URL}/api/v1/users/detail?username=${encodeURIComponent(cleanUsername)}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': KWAI_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('[Kwai API] Response:', data);

        if (!data || !data.data || !data.data.user) {
            throw new Error('Perfil não encontrado');
        }

        const user = data.data.user;
        const mainEntity = user.mainEntity || {};
        const interactions = mainEntity.interactionStatistic || [];

        // Find followers count (FollowAction)
        const followersStat = interactions.find((i: any) =>
            i.interactionType?.['@type'] === 'https://schema.org/FollowAction'
        );

        // Find video/post count (WriteAction in agentInteractionStatistic)
        const agentStats = mainEntity.agentInteractionStatistic || {};
        const videoCount = agentStats.interactionType?.['@type'] === 'https://schema.org/WriteAction'
            ? agentStats.userInteractionCount
            : 0;

        return {
            username: mainEntity.alternateName || cleanUsername,
            name: mainEntity.name || cleanUsername,
            avatarUrl: mainEntity.image || '',
            followerCount: followersStat?.userInteractionCount || 0,
            followingCount: 0, // Not provided in this structure
            videoCount: videoCount || 0,
            verified: false // Not explicitly provided
        };
    } catch (error) {
        console.error('Error fetching Kwai profile:', error);
        throw error;
    }
};

// ==================== Unified Profile Type ====================

export type SocialProfile = InstagramProfile | TikTokProfile | YouTubeChannel | KwaiProfile;

export interface GenericProfile {
    platform: PlatformId;
    username: string;
    displayName: string;
    avatarUrl: string;
    followerCount: number;
    contentCount: number;
    verified: boolean;
    extra?: any; // Platform-specific data (e.g., secUid for TikTok)
}
