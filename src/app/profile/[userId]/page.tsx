'use client';

import { useState, useEffect } from 'react';
import { mockUsers, mockFeedback } from '@/lib/data';
import type { User, Feedback } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { RequestSwapModal } from '@/components/request-swap-modal';

const MOCK_CURRENT_USER_ID = 'u2'; // In a real app, this would come from an auth context

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const foundUser = mockUsers.find(u => u.id === params.userId);
    const foundCurrentUser = mockUsers.find(u => u.id === MOCK_CURRENT_USER_ID);
    
    if (foundUser) {
      setUser({
          ...foundUser,
          feedback: mockFeedback.filter(f => f.reviewedId === foundUser.id)
      });
    }

    if(foundCurrentUser) {
        setCurrentUser(foundCurrentUser);
    }
  }, [params.userId]);

  if (!user) {
    // In a real app, you might show a loading skeleton here
    // For now, if not found after effect, assume not found.
    // A slight delay might be needed for the effect to run on client.
    // A better approach would be a dedicated loading state.
    const userExists = mockUsers.some(u => u.id === params.userId);
    if (!userExists) {
      notFound();
    }
    return <div>Loading profile...</div>
  }

  const averageRating = user.feedback.length > 0
    ? (user.feedback.reduce((acc, f) => acc + f.rating, 0) / user.feedback.length).toFixed(1)
    : 0;
    
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };


  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="bg-muted/40 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={user.profilePhotoUrl} alt={user.name} />
                <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold font-headline">{user.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mt-2 justify-center md:justify-start">
                    {user.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {user.location}</span>}
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Available on {user.availability}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold text-lg">{averageRating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({user.feedback.length} reviews)</span>
                </div>
              </div>
              <div className="md:ml-auto">
                <Button size="lg" onClick={() => setIsModalOpen(true)}>
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Request Swap
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold font-headline mb-3">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.map(skill => (
                  <Badge key={skill} className="text-sm py-1 px-3">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-headline mb-3">Skills Wanted</h3>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">{skill}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
            <h2 className="text-2xl font-bold font-headline mb-4">Feedback & Reviews</h2>
            <div className="space-y-4">
                {user.feedback.length > 0 ? user.feedback.map(fb => (
                    <Card key={fb.id}>
                        <CardContent className="p-4 flex gap-4">
                            <Avatar>
                                <AvatarImage src={mockUsers.find(u => u.id === fb.reviewerId)?.profilePhotoUrl} />
                                <AvatarFallback>{getInitials(mockUsers.find(u => u.id === fb.reviewerId)?.name || 'U')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{mockUsers.find(u => u.id === fb.reviewerId)?.name}</p>
                                    <div className="flex items-center text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'fill-current' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-muted-foreground mt-1 text-sm">{`For swap of "${mockUsers.find(u => u.id === fb.reviewedId)?.skillsWanted[0]}"`}</p>
                                <p className="mt-2">{fb.comment}</p>
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            This user doesn't have any feedback yet.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      </div>
      {currentUser && (
        <RequestSwapModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentUser={currentUser}
          targetUser={user}
        />
      )}
    </>
  );
}
