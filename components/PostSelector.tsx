import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, Heart, MessageCircle, Eye } from 'lucide-react';
import { InstagramPost, fetchInstagramPosts, TikTokPost, fetchTikTokPosts, YouTubeVideo, fetchYouTubeVideos } from '../services/api';
import { PlatformId } from '../types';

interface PostSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    platformId: PlatformId;
    packageQuantity: number;
    onConfirm: (posts: InstagramPost[] | TikTokPost[] | YouTubeVideo[]) => void;
    initialSelectedPosts?: InstagramPost[] | TikTokPost[] | YouTubeVideo[];
    extraData?: any; // For platform-specific data (e.g., TikTok secUid)
}

const PostSelector: React.FC<PostSelectorProps> = ({
    isOpen,
    onClose,
    username,
    platformId,
    packageQuantity,
    onConfirm,
    initialSelectedPosts = [],
    extraData
}) => {
    const [posts, setPosts] = useState<(InstagramPost | TikTokPost | YouTubeVideo)[]>([]);
    const [selectedPosts, setSelectedPosts] = useState<(InstagramPost | TikTokPost | YouTubeVideo)[]>(initialSelectedPosts);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && posts.length === 0) {
            loadPosts();
        }
    }, [isOpen]);

    // Reset selection if initialSelectedPosts changes (e.g. reopening modal)
    useEffect(() => {
        if (isOpen) {
            setSelectedPosts(initialSelectedPosts);
        }
    }, [isOpen, initialSelectedPosts]);

    const loadPosts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let fetchedPosts: any[];

            if (platformId === 'instagram') {
                fetchedPosts = await fetchInstagramPosts(username);
            } else if (platformId === 'tiktok') {
                // TikTok needs secUid from extraData
                if (!extraData?.secUid) {
                    throw new Error('secUid não encontrado');
                }
                fetchedPosts = await fetchTikTokPosts(extraData.secUid);
            } else if (platformId === 'youtube') {
                // YouTube needs channelId from extraData
                if (!extraData?.channelId) {
                    throw new Error('channelId não encontrado');
                }
                fetchedPosts = await fetchYouTubeVideos(extraData.channelId);
            } else {
                throw new Error('Plataforma não suportada');
            }

            setPosts(fetchedPosts);
        } catch (err) {
            setError('Não foi possível carregar as postagens. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePost = (post: InstagramPost | TikTokPost | YouTubeVideo) => {
        setSelectedPosts(prev => {
            const postId = 'id' in post ? post.id : (post as YouTubeVideo).video_id;
            const isSelected = prev.find(p => {
                const pId = 'id' in p ? p.id : (p as YouTubeVideo).video_id;
                return pId === postId;
            });
            if (isSelected) {
                return prev.filter(p => {
                    const pId = 'id' in p ? p.id : (p as YouTubeVideo).video_id;
                    return pId !== postId;
                });
            } else {
                return [...prev, post];
            }
        });
    };

    const quantityPerPost = selectedPosts.length > 0 ? Math.floor(packageQuantity / selectedPosts.length) : 0;
    const isValid = selectedPosts.length > 0 && quantityPerPost >= 50;

    // Helper to get display URL based on platform
    const getDisplayUrl = (post: InstagramPost | TikTokPost | YouTubeVideo) => {
        if (platformId === 'instagram') {
            return (post as InstagramPost).display_url;
        } else if (platformId === 'tiktok') {
            return (post as TikTokPost).coverUrl;
        } else {
            return (post as YouTubeVideo).thumbnail;
        }
    };

    // Helper to get likes/views count
    const getLikes = (post: InstagramPost | TikTokPost | YouTubeVideo) => {
        if (platformId === 'instagram') {
            return (post as InstagramPost).likes;
        } else if (platformId === 'tiktok') {
            return (post as TikTokPost).diggCount;
        } else {
            return (post as YouTubeVideo).view_count;
        }
    };

    // Helper to get comments count
    const getComments = (post: InstagramPost | TikTokPost | YouTubeVideo) => {
        if (platformId === 'instagram') {
            return (post as InstagramPost).comments;
        } else if (platformId === 'tiktok') {
            return (post as TikTokPost).commentCount;
        } else {
            return 0; // YouTube API doesn't return comment count in this endpoint
        }
    };

    if (!isOpen) return null;

    const contentType = platformId === 'tiktok' ? 'vídeos' : platformId === 'youtube' ? 'vídeos' : 'postagens';

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Selecione os {contentType}</h3>
                        <p className="text-sm text-slate-500">
                            Pacote de <strong>{packageQuantity}</strong> interações. Mínimo de 50 por {platformId === 'tiktok' ? 'vídeo' : 'post'}.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-xl"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p>Carregando seus {contentType}...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-red-500">
                            <AlertCircle className="w-10 h-10" />
                            <p>{error}</p>
                            <button onClick={loadPosts} className="text-primary hover:underline font-bold">Tentar novamente</button>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
                            <ImageIcon className="w-10 h-10" />
                            <p>Nenhum {platformId === 'tiktok' ? 'vídeo' : 'post'} encontrado.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {posts.map((post) => {
                                const postId = 'id' in post ? post.id : (post as YouTubeVideo).video_id;
                                const isSelected = !!selectedPosts.find(p => {
                                    const pId = 'id' in p ? p.id : (p as YouTubeVideo).video_id;
                                    return pId === postId;
                                });
                                return (
                                    <div
                                        key={postId}
                                        onClick={() => togglePost(post)}
                                        className={`
                      relative aspect-square cursor-pointer rounded-xl overflow-hidden group transition-all duration-200
                      ${isSelected ? 'ring-4 ring-primary ring-offset-2' : 'hover:opacity-90'}
                    `}
                                    >
                                        <img
                                            src={getDisplayUrl(post)}
                                            alt={platformId === 'tiktok' ? 'Vídeo' : 'Post'}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />

                                        {/* Overlay with stats */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                            <div className="flex items-center gap-3 text-white text-xs font-bold">
                                                {platformId === 'youtube' ? (
                                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 fill-white" /> {getLikes(post)}</span>
                                                ) : (
                                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 fill-white" /> {getLikes(post)}</span>
                                                )}
                                                {getComments(post) > 0 && (
                                                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 fill-white" /> {getComments(post)}</span>
                                                )}
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                                                <div className="bg-primary text-white rounded-full p-2 shadow-lg scale-110">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm">
                        {selectedPosts.length > 0 ? (
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900">
                                    {selectedPosts.length} {platformId === 'tiktok' ? 'vídeo' : 'post'}{selectedPosts.length !== 1 && 's'} selecionado{selectedPosts.length !== 1 && 's'}
                                </span>
                                <span className={`${isValid ? 'text-green-600' : 'text-red-500'} font-medium`}>
                                    {quantityPerPost} interações por {platformId === 'tiktok' ? 'vídeo' : 'post'}
                                </span>
                            </div>
                        ) : (
                            <span className="text-slate-500">Nenhum {platformId === 'tiktok' ? 'vídeo' : 'post'} selecionado</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {!isValid && selectedPosts.length > 0 && (
                            <span className="text-xs text-red-500 font-medium text-right hidden sm:block">
                                Mínimo de 50 por {platformId === 'tiktok' ? 'vídeo' : 'post'}.<br />Selecione menos {contentType} ou aumente o pacote.
                            </span>
                        )}
                        <button
                            onClick={() => onConfirm(selectedPosts)}
                            disabled={!isValid}
                            className="w-full sm:w-auto bg-slate-900 hover:bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirmar Seleção
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PostSelector;
