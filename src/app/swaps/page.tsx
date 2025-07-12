'use client';

import { useState, useMemo } from 'react';
import { mockSwaps, mockUsers } from '@/lib/data';
import type { Swap } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Trash2, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const MOCK_CURRENT_USER_ID = 'u1';

const getStatusVariant = (status: Swap['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'accepted': return 'default';
        case 'pending': return 'secondary';
        case 'rejected': return 'destructive';
        case 'completed': return 'outline';
        default: return 'secondary';
    }
}


const SwapCard = ({ swap, onAction }: { swap: Swap, onAction: (swapId: string, action: 'accept' | 'reject' | 'delete') => void }) => {
    const isResponder = swap.responderId === MOCK_CURRENT_USER_ID;
    const isRequester = swap.requesterId === MOCK_CURRENT_USER_ID;
    const otherUser = isResponder 
        ? mockUsers.find(u => u.id === swap.requesterId) 
        : mockUsers.find(u => u.id === swap.responderId);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[names.length - 1][0]}`;
        }
        return name.substring(0, 2);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Swap with {otherUser?.name}</CardTitle>
                <Badge variant={getStatusVariant(swap.status)} className="capitalize">{swap.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-center">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{isRequester ? 'You Offer' : `${otherUser?.name} Offers`}</p>
                        <p className="font-semibold">{swap.offeredSkill}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{isResponder ? 'You Get' : `${otherUser?.name} Gets`}</p>
                        <p className="font-semibold">{swap.wantedSkill}</p>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground border-l-2 pl-3 italic">
                    {swap.message}
                </div>
                <div className="text-xs text-muted-foreground text-right">
                    {swap.createdAt.toLocaleDateString()}
                </div>
            </CardContent>
            {swap.status === 'pending' && (
                <CardFooter className="flex justify-end gap-2">
                    {isResponder && (
                        <>
                            <Button variant="outline" size="sm" onClick={() => onAction(swap.id, 'reject')}><X className="mr-1 h-4 w-4"/> Reject</Button>
                            <Button size="sm" onClick={() => onAction(swap.id, 'accept')}><Check className="mr-1 h-4 w-4"/> Accept</Button>
                        </>
                    )}
                    {isRequester && (
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4"/> Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete your swap request. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onAction(swap.id, 'delete')}>
                                    Yes, delete it
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </CardFooter>
            )}
        </Card>
    )
};


export default function SwapsPage() {
    const [swaps, setSwaps] = useState<Swap[]>(mockSwaps.filter(s => s.requesterId === MOCK_CURRENT_USER_ID || s.responderId === MOCK_CURRENT_USER_ID));
    const { toast } = useToast();

    const handleAction = (swapId: string, action: 'accept' | 'reject' | 'delete') => {
        setSwaps(currentSwaps => {
            if (action === 'delete') {
                return currentSwaps.filter(s => s.id !== swapId);
            }
            return currentSwaps.map(s => s.id === swapId ? { ...s, status: action === 'accept' ? 'accepted' : 'rejected' } : s);
        });
        toast({
            title: `Request ${action === 'delete' ? 'deleted' : action + 'ed'}`,
            description: `The swap request has been successfully ${action === 'delete' ? 'deleted' : action + 'ed'}.`,
        });
    }

    const filteredSwaps = (status: Swap['status']) => 
        swaps.filter(s => s.status === status);

    const swapTabs: { status: Swap['status'], label: string }[] = [
        { status: 'pending', label: 'Pending' },
        { status: 'accepted', label: 'Accepted' },
        { status: 'completed', label: 'Completed' },
        { status: 'rejected', label: 'Rejected' },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Swap Inbox</h1>
                <p className="text-muted-foreground">Manage all your incoming and outgoing skill swap requests.</p>
            </div>
            
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    {swapTabs.map(tab => (
                        <TabsTrigger key={tab.status} value={tab.status}>
                            {tab.label} ({filteredSwaps(tab.status).length})
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {swapTabs.map(tab => (
                    <TabsContent key={tab.status} value={tab.status}>
                        {filteredSwaps(tab.status).length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredSwaps(tab.status)
                                    .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
                                    .map(swap => <SwapCard key={swap.id} swap={swap} onAction={handleAction} />)
                                }
                            </div>
                        ) : (
                            <div className="text-center py-16 rounded-lg bg-muted/30">
                                <p className="text-muted-foreground">No {tab.label.toLowerCase()} requests.</p>
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
