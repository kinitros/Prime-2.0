import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { PlatformData } from '../types';
import {
    fetchInstagramProfile, InstagramProfile,
    fetchTikTokProfile, TikTokProfile,
    fetchYouTubeChannel, YouTubeChannel,
    fetchKwaiProfile, KwaiProfile
} from '../services/api';

interface UsernameInputProps {
    platform: PlatformData;
    onProfileFound: (profile: any) => void;
    onBack: () => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ platform, onProfileFound, onBack }) => {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get platform-specific placeholder and label text
    const getPlaceholderText = () => {
        switch (platform.id) {
            case 'instagram':
                return 'seu_usuario';
            case 'tiktok':
                return 'seu_usuario';
            case 'youtube':
                return 'nome do canal';
            case 'kwai':
                return 'seu_usuario';
            default:
                return 'seu_usuario';
        }
    };

    const getLabelText = () => {
        switch (platform.id) {
            case 'instagram':
                return 'Qual é o seu @usuário?';
            case 'tiktok':
                return 'Qual é o seu @usuário do TikTok?';
            case 'youtube':
                return 'Qual é o nome do seu canal?';
            case 'kwai':
                return 'Qual é o seu @usuário do Kwai?';
            default:
                return 'Qual é o seu @usuário?';
        }
    };

    const getDescriptionText = () => {
        switch (platform.id) {
            case 'youtube':
                return 'Precisamos identificar seu canal para garantir que o serviço seja entregue corretamente.';
            default:
                return 'Precisamos identificar sua conta para garantir que o serviço seja entregue corretamente.';
        }
    };

    // Extract username from URL or clean input
    const extractUsername = (input: string, platformId: string): string => {
        let cleaned = input.trim();

        // Remove @ if present at the start
        cleaned = cleaned.replace(/^@/, '');

        // Try to extract from URL patterns
        try {
            // Instagram: https://www.instagram.com/username or instagram.com/username
            if (platformId === 'instagram' && (cleaned.includes('instagram.com') || cleaned.includes('instagr.am'))) {
                const match = cleaned.match(/(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9._]+)/);
                if (match) return match[1];
            }

            // TikTok: https://www.tiktok.com/@username or tiktok.com/@username
            if (platformId === 'tiktok' && cleaned.includes('tiktok.com')) {
                const match = cleaned.match(/tiktok\.com\/@?([a-zA-Z0-9._]+)/);
                if (match) return match[1];
            }

            // YouTube: https://www.youtube.com/@channelname or youtube.com/c/channelname
            if (platformId === 'youtube' && cleaned.includes('youtube.com')) {
                const match = cleaned.match(/youtube\.com\/(?:@|c\/|channel\/)?([a-zA-Z0-9_-]+)/);
                if (match) return match[1];
            }

            // Kwai: https://www.kwai.com/@username or kwai.com/@username
            if (platformId === 'kwai' && cleaned.includes('kwai.com')) {
                const match = cleaned.match(/kwai\.com\/@?([a-zA-Z0-9._]+)/);
                if (match) return match[1];
            }
        } catch (e) {
            console.error('Error parsing URL:', e);
        }

        // If no URL pattern matched, return cleaned input
        return cleaned;
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('Por favor, digite um usuário.');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Extract username from URL or clean the input
        const cleanedUsername = extractUsername(username, platform.id);

        if (!cleanedUsername) {
            setError('Por favor, digite um usuário válido.');
            setIsLoading(false);
            return;
        }

        try {
            let profile: any;

            switch (platform.id) {
                case 'instagram':
                    profile = await fetchInstagramProfile(cleanedUsername);
                    break;

                case 'tiktok':
                    profile = await fetchTikTokProfile(cleanedUsername);
                    break;

                case 'youtube':
                    profile = await fetchYouTubeChannel(cleanedUsername);
                    break;

                case 'kwai':
                    profile = await fetchKwaiProfile(cleanedUsername);
                    break;

                default:
                    // Fallback for platforms without API
                    setTimeout(() => {
                        onProfileFound({
                            username: cleanedUsername,
                            full_name: 'Usuário Simulado',
                            profile_pic_url: 'https://ui-avatars.com/api/?name=' + cleanedUsername,
                            follower_count: 1000,
                            following_count: 500,
                            media_count: 10,
                            is_private: false,
                            is_verified: false
                        });
                    }, 1000);
                    return;
            }

            onProfileFound(profile);
        } catch (err) {
            setError('Perfil não encontrado ou erro na busca. Verifique o nome de usuário.');
        } finally {
            setIsLoading(false);
        }
    };

    const shouldShowAtSymbol = platform.id !== 'youtube';

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <h3 className="text-xl font-bold text-slate-900">Identifique seu perfil</h3>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">

                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Search className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">{getLabelText()}</h2>
                <p className="text-slate-500 mb-8">
                    {getDescriptionText()}
                </p>

                <form onSubmit={handleSearch} className="w-full space-y-4">
                    <div className="relative">
                        {shouldShowAtSymbol && (
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold">@</span>
                            </div>
                        )}
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={getPlaceholderText()}
                            className={`w-full ${shouldShowAtSymbol ? 'pl-10' : 'pl-4'} pr-4 py-4 bg-slate-50 border-2 rounded-xl text-lg font-medium outline-none transition-all ${error ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:border-primary focus:bg-white'}`}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg animate-fade-in">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !username.trim()}
                        className="w-full bg-slate-900 hover:bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Buscando perfil...
                            </>
                        ) : (
                            <>
                                Continuar
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Não pedimos sua senha. Apenas o {platform.id === 'youtube' ? 'nome do canal' : '@usuário'}.
                </div>
            </div>
        </div>
    );
};

export default UsernameInput;
