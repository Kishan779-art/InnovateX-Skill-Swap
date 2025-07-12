'use client';

import { useState, useEffect } from 'react';
import { mockSwaps, mockUsers } from '@/lib/data';
import type { Swap, User } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Trash2, X, Users, MessageSquare } from 'lucide-react';
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
import { AnimatePresence, motion } from 'framer-motion';

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

const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
};

const SwapCard = ({ swap, onAction, onDelete }: { swap: Swap, onAction: (swapId: string, action: 'accept' | 'reject') => void, onDelete: (swapId: string) => void }) => {
    const [otherUser, setOtherUser] = useState<User | undefined>();

    const isResponder = swap.responderId === MOCK_CURRENT_USER_ID;
    const isRequester = swap.requesterId === MOCK_CURRENT_USER_ID;

    useEffect(() => {
        const otherUserId = isResponder ? swap.requesterId : swap.responderId;
        const user = mockUsers.find(u => u.id === otherUserId);
        setOtherUser(user);
    }, [swap, isResponder]);

    if (!otherUser) {
        return (
            <Card className="flex flex-col h-full bg-card/50 backdrop-blur-md border border-dashed shadow-none">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Swap with an unknown user</CardTitle>
                    <Badge variant="destructive">Invalid</Badge>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">This swap can no longer be processed.</p>
                </CardContent>
                 <CardFooter className="flex justify-end gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this swap?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will permanently remove this swap from your inbox. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(swap.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        );
    }
    
    return (
        <Card className="flex flex-col h-full bg-card/50 backdrop-blur-md border-primary/10 shadow-md transition-shadow hover:shadow-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={otherUser.profilePhotoUrl} />
                        <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base font-semibold">{otherUser.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{isRequester ? 'You sent a request' : 'You received a request'}</p>
                    </div>
                </div>
                <Badge variant={getStatusVariant(swap.status)} className="capitalize">{swap.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
                <div className="flex items-center justify-between gap-2 text-center p-3 bg-muted/50 rounded-md">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{isRequester ? 'You Offer' : `${otherUser.name} Offers`}</p>
                        <p className="font-semibold">{swap.offeredSkill}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{isRequester ? `${otherUser.name} Wants` : 'You Want'}</p>
                        <p className="font-semibold">{swap.wantedSkill}</p>
                    </div>
                </div>
                {swap.message && (
                    <div className="text-sm text-muted-foreground border-l-2 border-primary pl-3 italic flex gap-2">
                         <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        "{swap.message}"
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 {swap.status === 'pending' && isResponder && (
                    <>
                        <Button variant="outline" size="sm" onClick={() => onAction(swap.id, 'reject')}><X className="mr-1 h-4 w-4"/> Reject</Button>
                        <Button size="sm" onClick={() => onAction(swap.id, 'accept')}><Check className="mr-1 h-4 w-4"/> Accept</Button>
                    </>
                )}
                {swap.status === 'pending' && isRequester && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><X className="mr-1 h-4 w-4"/> Cancel Request</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will permanently cancel your swap request. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(swap.id)}>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                 {(swap.status === 'rejected' || swap.status === 'completed' || swap.status === 'accepted') && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this swap?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will permanently remove this swap from your inbox. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(swap.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardFooter>
        </Card>
    )
};


export default function SwapsPage() {
    const [swaps, setSwaps] = useState<Swap[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        // Simulating fetching swaps for the current user
        setSwaps(mockSwaps.filter(s => s.requesterId === MOCK_CURRENT_USER_ID || s.responderId === MOCK_CURRENT_USER_ID));
    }, []);

    const handleAction = (swapId: string, action: 'accept' | 'reject') => {
        setSwaps(currentSwaps => {
            return currentSwaps.map(s => s.id === swapId ? { ...s, status: action === 'accept' ? 'accepted' : 'rejected' } : s);
        });
        toast({
            title: `Request ${action}ed`,
            description: `The swap request has been successfully ${action}ed.`,
        });
    }

    const handleDelete = (swapId: string) => {
        setSwaps(currentSwaps => currentSwaps.filter(s => s.id !== swapId));
        toast({
            title: 'Request Removed',
            description: 'The swap has been removed from your inbox.',
        });
    };

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
            <div className="mb-6 animate-fade-in-up">
                <h1 className="text-3xl font-bold font-headline">Swap Inbox</h1>
                <p className="text-muted-foreground">Manage all your incoming and outgoing skill swap requests.</p>
            </div>
            
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    {swapTabs.map(tab => (
                        <TabsTrigger key={tab.status} value={tab.status}>
                            {tab.label} ({filteredSwaps(tab.status).length})
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {swapTabs.map(tab => (
                    <TabsContent key={tab.status} value={tab.status} className="animate-tab-content">
                         <AnimatePresence>
                            {filteredSwaps(tab.status).length > 0 ? (
                                <motion.div 
                                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
                                    exit={{ opacity: 0 }}
                                >
                                    {filteredSwaps(tab.status)
                                        .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
                                        .map(swap => (
                                            <motion.div
                                                key={swap.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                            >
                                                <SwapCard swap={swap} onAction={handleAction} onDelete={handleDelete} />
                                            </motion.div>
                                        ))
                                    }
                                </motion.div>
                            ) : (
                                <div className="text-center py-16 rounded-lg bg-card/50 mt-4 backdrop-blur-md">
                                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4 text-muted-foreground">No {tab.label.toLowerCase()} requests.</p>
                                </div>
                            )}
                         </AnimatePresence>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
