import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserPlus, Clock, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    sendRequest,
    acceptRequest,
    removeConnection,
} from '@/actions/App/Http/Controllers/ConnectionController';

export type ConnectionStatus =
    | 'sent_pending'
    | 'received_pending'
    | 'accepted'
    | 'self'
    | null
    | undefined;

interface ConnectButtonProps {
    userId: number;
    connectionStatus: ConnectionStatus;
    className?: string;
}

export const ConnectButton = ({
    userId,
    connectionStatus,
    className = '',
}: ConnectButtonProps) => {
    const [status, setStatus] = useState<ConnectionStatus>(connectionStatus);

    const handleConnect = () => {
        const prev = status;
        setStatus('sent_pending');
        router.post(sendRequest(userId).url, {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setStatus(prev);
                toast.error('Failed to send connection request.');
            },
        });
    };

    const handleCancel = () => {
        const prev = status;
        setStatus(null);
        router.delete(removeConnection(userId).url, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setStatus(prev);
                toast.error('Failed to cancel connection request.');
            },
        });
    };

    const handleAccept = () => {
        const prev = status;
        setStatus('accepted');
        router.post(acceptRequest(userId).url, {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setStatus(prev);
                toast.error('Failed to accept connection request.');
            },
        });
    };

    if (status === 'self') {
        return null;
    }

    if (status === 'accepted') {
        return (
            <Button
                variant="outline"
                size="sm"
                disabled
                className={`h-8 rounded-xl border-[#2DAB94] bg-[#E6F6F4] px-3 text-xs font-bold text-[#2DAB94] ${className}`}
            >
                <Users className="mr-1.5 h-3.5 w-3.5" />
                Connected
            </Button>
        );
    }

    if (status === 'sent_pending') {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className={`h-8 rounded-xl border-slate-200 px-3 text-xs font-bold text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 ${className}`}
            >
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Pending
            </Button>
        );
    }

    if (status === 'received_pending') {
        return (
            <Button
                size="sm"
                onClick={handleAccept}
                className={`h-8 rounded-xl bg-[#2DAB94] px-3 text-xs font-bold text-white hover:bg-[#27967F] ${className}`}
            >
                <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                Accept
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleConnect}
            className={`h-8 rounded-xl border-[#2DAB94] px-3 text-xs font-bold text-[#2DAB94] hover:bg-[#E6F6F4] ${className}`}
        >
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Connect
        </Button>
    );
};
