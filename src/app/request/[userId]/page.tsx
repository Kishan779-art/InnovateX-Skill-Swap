
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, notFound, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, ArrowRightLeft, Brush, Code, Megaphone, Mic, Video, DraftingCompass, CookingPot, Guitar, HeartHandshake } from 'lucide-react';

const MOCK_CURRENT_USER_ID = 'u1';

const swapRequestSchema = z.object({
  offeredSkill: z.string({ required_error: 'Please select a skill to offer.' }),
  wantedSkill: z.string({ required_error: 'Please select a skill you want.' }),
  message: z.string().min(10, 'Message must be at least 10 characters.').max(500, 'Message cannot exceed 500 characters.'),
});

const skillIconMap: { [key: string]: React.ElementType } = {
  'Web Development': Code, 'React': Code, 'Node.js': Code,
  'Graphic Design': Brush, 'Illustration': Brush, 'Logo Design': Brush,
  'Marketing Strategy': Megaphone, 'SEO': Megaphone,
  'Public Speaking': Mic, 'Music Production': Mic,
  'Videography': Video,
  'Architecture': DraftingCompass,
  'Baking': CookingPot, 'Cooking': CookingPot,
  'Guitar Lessons': Guitar,
  'Pottery': HeartHandshake,
};

const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) { return `${names[0][0]}${names[names.length - 1][0]}`; }
    return name.substring(0, 2);
};

const SkillSelectItem = ({ skill }: { skill: string }) => {
    const Icon = skillIconMap[skill] || HeartHandshake;
    return (
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <span>{skill}</span>
        </div>
    );
};

export default function RequestPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);

  useEffect(() => {
    const current = mockUsers.find(u => u.id === MOCK_CURRENT_USER_ID);
    const target = mockUsers.find(u => u.id === params.userId);

    if (!current || !target) {
      notFound();
    }
    
    setCurrentUser(current);
    setTargetUser(target);

    form.reset({
      message: `Hi ${target.name}, I noticed we could help each other out. I'd be happy to trade my skills for yours!`,
    });
  }, [params.userId]);
  
  const form = useForm<z.infer<typeof swapRequestSchema>>({
    resolver: zodResolver(swapRequestSchema),
    defaultValues: { message: '' },
  });

  const onSubmit = (values: z.infer<typeof swapRequestSchema>) => {
    console.log('Swap request submitted:', values);
    toast({
      title: 'Request Sent!',
      description: `Your swap request has been sent to ${targetUser?.name}.`,
    });
    router.push('/');
  };

  if (!currentUser || !targetUser) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="ghost" asChild className="mb-4">
            <Link href={`/profile/${targetUser.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {targetUser.name.split(' ')[0]}'s Profile
            </Link>
        </Button>
      </motion.div>

      <div className="glowing-card !p-0">
        <div className="glowing-card-content !rounded-lg p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="flex justify-center items-center gap-4 md:gap-8">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Avatar className="h-24 w-24 border-2 border-primary">
                            <AvatarImage src={currentUser.profilePhotoUrl} />
                            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                        </Avatar>
                        <p className="font-bold">You</p>
                        <p className="text-xs text-muted-foreground">{currentUser.name}</p>
                    </div>
                    <ArrowRightLeft className="h-10 w-10 text-primary shrink-0" />
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Avatar className="h-24 w-24 border-2 border-accent">
                             <AvatarImage src={targetUser.profilePhotoUrl} />
                            <AvatarFallback>{getInitials(targetUser.name)}</AvatarFallback>
                        </Avatar>
                        <p className="font-bold">{targetUser.name.split(' ')[0]}</p>
                        <p className="text-xs text-muted-foreground">{targetUser.name}</p>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <h1 className="text-3xl font-headline">Propose a Skill Swap</h1>
                    <p className="text-muted-foreground mt-1">Choose the skills you want to exchange.</p>
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="offeredSkill"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-primary text-lg">You Offer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="neon-input h-12 text-base">
                                <SelectValue placeholder="Select a skill..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {currentUser.skillsOffered.map(skill => (
                                <SelectItem key={skill} value={skill}><SkillSelectItem skill={skill} /></SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="wantedSkill"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-accent text-lg">You Want</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="neon-input h-12 text-base">
                                <SelectValue placeholder="Select a skill..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {targetUser.skillsOffered.map(skill => (
                                <SelectItem key={skill} value={skill}><SkillSelectItem skill={skill} /></SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    </div>
                    <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-lg">Personalized Message</FormLabel>
                        <div className="relative">
                            <FormControl>
                                <Textarea
                                placeholder="Introduce yourself and propose the swap..."
                                className="resize-none neon-input text-base"
                                rows={5}
                                {...field}
                                />
                            </FormControl>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" size="lg" className="btn-liquid"><span>Send Request</span></Button>
                    </div>
                </form>
                </Form>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
