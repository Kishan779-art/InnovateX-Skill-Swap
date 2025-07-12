'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SkillTagsInput } from '@/components/skill-tags-input';
import { SkillSuggestionModal } from '@/components/skill-suggestion-modal';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  location: z.string().optional(),
  availability: z.string(),
  skillsOffered: z.array(z.string()).min(1, { message: 'Please offer at least one skill.' }),
  skillsWanted: z.array(z.string()).min(1, { message: 'Please select at least one skill you want.' }),
  profileStatus: z.enum(['public', 'private']),
});

// Mock current user - in a real app, this would come from an auth context
const MOCK_USER_ID = 'u1';

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isSuggestionModalOpen, setSuggestionModalOpen] = useState(false);

  useEffect(() => {
    // Fetch user data
    const currentUser = mockUsers.find(u => u.id === MOCK_USER_ID);
    if (currentUser) {
      setUser(currentUser);
      form.reset({
        name: currentUser.name,
        location: currentUser.location,
        availability: currentUser.availability,
        skillsOffered: currentUser.skillsOffered,
        skillsWanted: currentUser.skillsWanted,
        profileStatus: currentUser.profileStatus,
      });
    }
  }, []);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      location: '',
      skillsOffered: [],
      skillsWanted: [],
      profileStatus: 'public',
    },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    console.log('Profile updated:', values);
    toast({
      title: 'Profile Saved',
      description: 'Your changes have been successfully saved.',
    });
    // In a real app, this would navigate to the user's public profile page
    router.push(`/profile/${MOCK_USER_ID}`);
  };

  const onDiscard = () => {
    if (user) {
        form.reset({
            name: user.name,
            location: user.location,
            availability: user.availability,
            skillsOffered: user.skillsOffered,
            skillsWanted: user.skillsWanted,
            profileStatus: user.profileStatus,
        });
        toast({
            title: 'Changes Discarded',
            description: 'Your profile information has been reverted.',
            variant: 'destructive'
        });
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-headline">Edit Your Profile</h1>
              <p className="text-muted-foreground">Keep your skills and information up to date.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onDiscard}>Discard</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This information will be displayed on your public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-accent">
                  <AvatarImage src={user.profilePhotoUrl} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{user.name}</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input placeholder="City, Country" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Skills & Availability</CardTitle>
                    <CardDescription>What can you teach? What do you want to learn?</CardDescription>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setSuggestionModalOpen(true)}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Suggest Skills
                  </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="skillsOffered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills You Offer</FormLabel>
                    <FormControl>
                      <SkillTagsInput value={field.value} onChange={field.onChange} placeholder="Add a skill you can teach..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skillsWanted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills You Want</FormLabel>
                    <FormControl>
                      <SkillTagsInput value={field.value} onChange={field.onChange} placeholder="Add a skill you want to learn..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select your general availability" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="evenings">Evenings</SelectItem>
                            <SelectItem value="weekends">Weekends</SelectItem>
                            <SelectItem value="weekdays">Weekdays</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profileStatus"
                    render={({ field }) => (
                      <FormItem className="flex flex-col rounded-lg border p-4">
                        <FormLabel className="mb-2">Profile Visibility</FormLabel>
                        <div className="flex items-center space-x-2">
                           <FormControl>
                             <Switch
                               checked={field.value === 'public'}
                               onCheckedChange={(checked) => field.onChange(checked ? 'public' : 'private')}
                              />
                           </FormControl>
                           <span className="text-sm text-muted-foreground">
                            {field.value === 'public' ? 'Public - Visible to everyone' : 'Private - Hidden from search'}
                           </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <SkillSuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setSuggestionModalOpen(false)}
        currentSkills={form.getValues()}
        onApplySuggestions={({ suggestedSkillsToOffer, suggestedSkillsToRequest }) => {
            const currentOffered = form.getValues('skillsOffered');
            const currentWanted = form.getValues('skillsWanted');
            form.setValue('skillsOffered', [...new Set([...currentOffered, ...suggestedSkillsToOffer])]);
            form.setValue('skillsWanted', [...new Set([...currentWanted, ...suggestedSkillsToRequest])]);
            setSuggestionModalOpen(false);
            toast({ title: "Skills Added!", description: "Suggested skills have been added to your profile." });
        }}
      />
    </>
  );
}
