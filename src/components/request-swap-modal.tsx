
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowRightLeft, Brush, Code, Megaphone, Mic, Video, DraftingCompass, CookingPot, Guitar, HeartHandshake } from 'lucide-react';

interface RequestSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  targetUser: User;
}

const swapRequestSchema = z.object({
  offeredSkill: z.string({ required_error: 'Please select a skill to offer.' }),
  wantedSkill: z.string({ required_error: 'Please select a skill you want.' }),
  message: z.string().min(10, 'Message must be at least 10 characters.').max(500, 'Message cannot exceed 500 characters.'),
});

// A simple map to get icons for skills
const skillIconMap: { [key: string]: React.ElementType } = {
  'Web Development': Code,
  'React': Code,
  'Node.js': Code,
  'Graphic Design': Brush,
  'Illustration': Brush,
  'Logo Design': Brush,
  'Marketing Strategy': Megaphone,
  'SEO': Megaphone,
  'Public Speaking': Mic,
  'Music Production': Mic,
  'Videography': Video,
  'Architecture': DraftingCompass,
  'Baking': CookingPot,
  'Cooking': CookingPot,
  'Guitar Lessons': Guitar,
  'Pottery': HeartHandshake,
};

const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
};

const SkillSelectItem = ({ skill }: { skill: string }) => {
    const Icon = skillIconMap[skill] || HeartHandshake;
    return (
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <span>{skill}</span>
        </div>
    )
};


export function RequestSwapModal({ isOpen, onClose, currentUser, targetUser }: RequestSwapModalProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof swapRequestSchema>>({
    resolver: zodResolver(swapRequestSchema),
    defaultValues: {
      message: `Hi ${targetUser.name}, I noticed we could help each other out. I'd be happy to trade my skills for yours!`,
    },
  });

  const onSubmit = (values: z.infer<typeof swapRequestSchema>) => {
    console.log('Swap request submitted:', values);
    toast({
      title: 'Request Sent!',
      description: `Your swap request has been sent to ${targetUser.name}.`,
    });
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glowing-card !p-0">
        <div className="glowing-card-content !rounded-lg">
            <DialogHeader className="p-6 pb-4">
                <div className="flex justify-center items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-16 w-16 border-2 border-primary">
                            <AvatarImage src={currentUser.profilePhotoUrl} />
                            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-bold">You</p>
                    </div>
                    <ArrowRightLeft className="h-8 w-8 text-primary shrink-0" />
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-16 w-16 border-2 border-accent">
                             <AvatarImage src={targetUser.profilePhotoUrl} />
                            <AvatarFallback>{getInitials(targetUser.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-bold">{targetUser.name.split(' ')[0]}</p>
                    </div>
                </div>
              <DialogTitle className="text-center text-2xl font-headline pt-4">Propose a Skill Swap</DialogTitle>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6">
                <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="offeredSkill"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-primary">You Offer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="neon-input">
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
                    <FormLabel className="text-accent">You Want</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="neon-input">
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
                    <FormLabel>Personalized Message</FormLabel>
                     <div className="relative">
                        <FormControl>
                            <Textarea
                            placeholder="Introduce yourself and propose the swap..."
                            className="resize-none neon-input"
                            rows={4}
                            {...field}
                            />
                        </FormControl>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <DialogFooter className="pt-4 pb-6">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="btn-liquid"><span>Send Request</span></Button>
                </DialogFooter>
            </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
