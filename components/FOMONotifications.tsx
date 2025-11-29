import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface Notification {
    id: number;
    name: string;
    location: string;
    service: string;
    platform: string;
    time: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
    { id: 1, name: 'Maria S.', location: 'São Paulo, SP', service: '5.000 Seguidores', platform: 'Instagram', time: '2 minutos atrás' },
    { id: 2, name: 'João P.', location: 'Rio de Janeiro, RJ', service: '10.000 Curtidas', platform: 'TikTok', time: '5 minutos atrás' },
    { id: 3, name: 'Ana C.', location: 'Belo Horizonte, MG', service: '2.500 Seguidores', platform: 'Instagram', time: '8 minutos atrás' },
    { id: 4, name: 'Carlos M.', location: 'Brasília, DF', service: '15.000 Views', platform: 'YouTube', time: '12 minutos atrás' },
    { id: 5, name: 'Juliana F.', location: 'Curitiba, PR', service: '7.500 Curtidas', platform: 'Instagram', time: '15 minutos atrás' },
    { id: 6, name: 'Pedro L.', location: 'Fortaleza, CE', service: '3.000 Seguidores', platform: 'TikTok', time: '18 minutos atrás' },
    { id: 7, name: 'Fernanda R.', location: 'Salvador, BA', service: '20.000 Views', platform: 'Instagram', time: '22 minutos atrás' },
    { id: 8, name: 'Ricardo S.', location: 'Recife, PE', service: '5.000 Curtidas', platform: 'TikTok', time: '25 minutos atrás' },
    { id: 9, name: 'Camila T.', location: 'Porto Alegre, RS', service: '8.000 Seguidores', platform: 'Instagram', time: '30 minutos atrás' },
    { id: 10, name: 'Lucas O.', location: 'Manaus, AM', service: '12.000 Views', platform: 'YouTube', time: '35 minutos atrás' },
    { id: 11, name: 'Beatriz M.', location: 'Goiânia, GO', service: '4.000 Seguidores', platform: 'Instagram', time: '40 minutos atrás' },
    { id: 12, name: 'Rafael K.', location: 'Belém, PA', service: '25.000 Curtidas', platform: 'TikTok', time: '45 minutos atrás' },
    { id: 13, name: 'Gabriela N.', location: 'Vitória, ES', service: '6.500 Seguidores', platform: 'Instagram', time: '50 minutos atrás' },
    { id: 14, name: 'Thiago B.', location: 'Florianópolis, SC', service: '18.000 Views', platform: 'YouTube', time: '55 minutos atrás' },
    { id: 15, name: 'Amanda V.', location: 'Natal, RN', service: '9.000 Curtidas', platform: 'Instagram', time: '1 hora atrás' },
];

const FOMONotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const currentIndexRef = React.useRef(0);

    const showNextNotification = React.useCallback(() => {
        const nextNotification = SAMPLE_NOTIFICATIONS[currentIndexRef.current % SAMPLE_NOTIFICATIONS.length];
        setNotifications([nextNotification]);
        currentIndexRef.current += 1;

        // Schedule next notification (between 8-15 seconds)
        const randomDelay = Math.floor(Math.random() * 7000) + 8000;
        setTimeout(() => {
            showNextNotification();
        }, randomDelay);
    }, []);

    useEffect(() => {
        // Show first notification after 3 seconds
        const initialTimeout = setTimeout(() => {
            showNextNotification();
        }, 3000);

        return () => clearTimeout(initialTimeout);
    }, [showNextNotification]);

    useEffect(() => {
        if (notifications.length > 0) {
            // Auto-hide after 5 seconds
            const hideTimeout = setTimeout(() => {
                hideNotification(notifications[0].id);
            }, 5000);

            return () => clearTimeout(hideTimeout);
        }
    }, [notifications]);

    const hideNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
            <div className="space-y-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 pr-12 max-w-sm animate-slide-in-left relative overflow-hidden"
                    >
                        {/* Accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary"></div>

                        {/* Close button */}
                        <button
                            onClick={() => hideNotification(notification.id)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-bold text-slate-900 text-sm">{notification.name}</p>
                                    <span className="text-xs text-slate-400">•</span>
                                    <p className="text-xs text-slate-500">{notification.location}</p>
                                </div>

                                <p className="text-sm text-slate-600 mb-1">
                                    Comprou <span className="font-bold text-primary">{notification.service}</span> para {notification.platform}
                                </p>

                                <p className="text-xs text-slate-400">{notification.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out;
        }
      `}</style>
        </div>
    );
};

export default FOMONotifications;
