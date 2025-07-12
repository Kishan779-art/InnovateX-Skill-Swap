import Link from 'next/link';
import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useGlow } from '@/hooks/use-glow';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const { ref, style } = useGlow();

  const averageRating = user.feedback.length > 0
    ? (user.feedback.reduce((acc, f) => acc + f.rating, 0) / user.feedback.length).toFixed(1)
    : 'New';

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <div ref={ref} style={style} className="glowing-card rounded-lg">
      <div className="glowing-card-content p-px">
        <Card className="flex flex-col h-full bg-card/95 backdrop-blur-sm border-none shadow-none rounded-[calc(var(--radius)-1px)]">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar className="h-16 w-16 border-2 border-primary/50">
                <AvatarImage src={user.profilePhotoUrl} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                <CardTitle className="text-lg font-headline leading-tight">{user.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{averageRating} ({user.feedback.length})</span>
                </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow space-y-3">
                <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Offers</h4>
                <div className="flex flex-wrap gap-1.5">
                    {user.skillsOffered.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                    {user.skillsOffered.length > 3 && <Badge variant="outline">+{user.skillsOffered.length - 3} more</Badge>}
                </div>
                </div>
                <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Wants</h4>
                <div className="flex flex-wrap gap-1.5">
                    {user.skillsWanted.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                    {user.skillsWanted.length > 3 && <Badge variant="outline">+{user.skillsWanted.length - 3} more</Badge>}
                </div>
                </div>
            </CardContent>
            <div className="p-4 pt-0">
                <Button asChild variant="liquid" className="w-full">
                    <Link href={`/profile/${user.id}`}>
                        <span>View Profile</span>
                    </Link>
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
}
