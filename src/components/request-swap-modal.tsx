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

export function RequestSwapModal({ isOpen, onClose, currentUser, targetUser }: RequestSwapModalProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof swapRequestSchema>>({
    resolver: zodResolver(swapRequestSchema),
    defaultValues: {
      message: `Hi ${targetUser.name}, I'm interested in swapping skills. I can offer...`,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Request a Swap with {targetUser.name}</DialogTitle>
          <DialogDescription>
            Choose the skills you want to exchange and send a message to start the conversation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="offeredSkill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>You Offer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select one of your skills" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentUser.skillsOffered.map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
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
                  <FormLabel>You Want</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select a skill from ${targetUser.name}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {targetUser.skillsOffered.map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Introduce yourself and propose the swap..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Send Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
