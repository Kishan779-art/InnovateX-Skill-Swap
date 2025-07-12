import Link from 'next/link';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, MessageSquare, User as UserIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
  onRequestSwap: (user: User) => void;
}

export function UserCard({ user, onRequestSwap }: UserCardProps) {

  const averageRating = user.feedback && user.feedback.length > 0
    ? (user.feedback.reduce((acc, f) => acc + f.rating, 0) / user.feedback.length).toFixed(1)
    : 'New';

  const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <div className="glowing-card h-full">
        <Card className="glowing-card-content flex flex-col h-full bg-card/95 backdrop-blur-sm shadow-lg border-transparent">
            <CardHeader className="flex flex-col items-center text-center p-6">
                <Avatar className="h-20 w-20 border-2 border-primary/50 mb-3">
                    <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint={user.data_ai_hint} />
                    <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-headline leading-tight">{user.name}</CardTitle>
                 <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{averageRating} ({user.feedback ? user.feedback.length : 0} reviews)</span>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-grow space-y-4">
                <div className="text-center">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Offers</h4>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                        {user.skillsOffered.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                        {user.skillsOffered.length > 3 && <Badge variant="outline">+{user.skillsOffered.length - 3}</Badge>}
                    </div>
                </div>
                 <div className="flex items-center justify-center text-muted-foreground">
                    <hr className="w-8 border-border" />
                    <ArrowRight className="h-4 w-4 mx-2 text-primary" />
                    <hr className="w-8 border-border" />
                </div>
                <div className="text-center">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Wants</h4>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                        {user.skillsWanted.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                        {user.skillsWanted.length > 3 && <Badge variant="outline">+{user.skillsWanted.length - 3}</Badge>}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" className="w-full">
                    <Link href={`/profile/${user.id}`}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </Button>
                <Button onClick={() => onRequestSwap(user)} className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Request
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
