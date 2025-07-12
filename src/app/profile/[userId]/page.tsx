'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockUsers, mockFeedback, mockSwaps } from '@/lib/data';
import type { User, Feedback } from '@/lib/types';
import { notFound, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Calendar, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const MOCK_CURRENT_USER_ID = 'u1'; // In a real app, this would come from an auth context

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
};

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  
  useEffect(() => {
    const foundUser = mockUsers.find(u => u.id === params.userId);
    
    if (foundUser) {
      setUser(foundUser);
      setFeedback(mockFeedback.filter(f => f.reviewedId === foundUser.id));
    } else {
      notFound();
    }
  }, [params.userId]);

  if (!user) {
    // This could be a skeleton loader in a real app
    return <div>Loading profile...</div>
  }

  const averageRating = feedback.length > 0
    ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden bg-card/50 backdrop-blur-md border-primary/20 shadow-lg shadow-primary/10">
        <div className="bg-muted/40 p-8">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
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
                  <span className="text-sm text-muted-foreground">({feedback.length} reviews)</span>
              </div>
            </div>
            <div className="md:ml-auto">
              <Button size="lg" asChild className="btn-liquid">
                  <Link href={`/request/${user.id}`}>
                    <span><MessageSquare className="mr-2 h-5 w-5 inline-block" />
                    Request Swap</span>
                  </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        <CardContent className="p-6 grid md:grid-cols-2 gap-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={0}
          >
            <h3 className="text-xl font-semibold font-headline mb-3 text-primary">Skills Offered</h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.map(skill => (
                <Badge key={skill} className="text-sm py-1 px-3">{skill}</Badge>
              ))}
            </div>
          </motion.div>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={1}
          >
            <h3 className="text-xl font-semibold font-headline mb-3 text-accent">Skills Wanted</h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.map(skill => (
                <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">{skill}</Badge>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div 
        className="mt-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={2}
      >
          <h2 className="text-2xl font-bold font-headline mb-4">Feedback & Reviews</h2>
          <div className="space-y-4">
              {feedback.length > 0 ? feedback.map(fb => {
                  const reviewer = mockUsers.find(u => u.id === fb.reviewerId);
                  if (!reviewer) return null;
                  
                  const relevantSwap = mockSwaps.find(s => s.id === fb.swapId);
                  const skillInvolved = relevantSwap ? (relevantSwap.requesterId === reviewer.id ? relevantSwap.wantedSkill : relevantSwap.offeredSkill) : 'a skill';

                  return (
                  <Card key={fb.id} className="bg-card/50 backdrop-blur-md border border-primary/20">
                      <CardContent className="p-4 flex gap-4">
                          <Avatar>
                              <AvatarImage src={reviewer.profilePhotoUrl} />
                              <AvatarFallback>{getInitials(reviewer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <div className="flex items-center gap-2">
                                  <p className="font-semibold">{reviewer.name}</p>
                                  <div className="flex items-center text-amber-500">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'fill-current' : 'text-gray-600'}`} />
                                      ))}
                                  </div>
                              </div>
                              <p className="text-muted-foreground mt-1 text-sm">{`For swap of "${skillInvolved}"`}</p>
                              <p className="mt-2">{fb.comment}</p>
                          </div>
                      </CardContent>
                  </Card>
                  )
              }) : (
                  <Card className="bg-card/50 backdrop-blur-md border border-primary/20">
                      <CardContent className="p-6 text-center text-muted-foreground">
                          This user doesn't have any feedback yet.
                      </CardContent>
                  </Card>
              )}
          </div>
      </motion.div>
    </div>
  );
}
