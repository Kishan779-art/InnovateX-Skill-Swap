'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Fingerprint } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

// Mock auth hook
const useAuth = () => {
    const router = useRouter();
    const login = () => {
        localStorage.setItem('isLoggedIn', 'true');
        window.dispatchEvent(new Event("storage"));
        router.push('/');
    };
    return { login };
};


export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log('Login attempt with:', values);
    toast({
      title: 'Login Successful',
      description: "Welcome back! You're being redirected.",
    });
    login();
  }

  return (
    <div className="flex items-center justify-center min-h-full py-12 px-4">
      <motion.div
        className="w-full max-w-md space-y-8 p-8 md:p-10 rounded-2xl bg-card/50 backdrop-blur-md border border-primary/20 shadow-2xl shadow-primary/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-center">
            <Fingerprint className="mx-auto h-12 w-12 text-primary neon-text" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-primary neon-text font-headline">
                Access Your Hub
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Enter the network to connect and grow your skills.
            </p>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="floating-label-input relative">
                      <FormControl>
                        <Input placeholder=" " {...field} className="neon-input"/>
                      </FormControl>
                      <label htmlFor={field.name}>Email Address</label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                     <div className="floating-label-input relative">
                        <FormControl>
                            <Input type="password" placeholder=" " {...field} className="neon-input" />
                        </FormControl>
                        <label htmlFor={field.name}>Password</label>
                    </div>
                    <div className="flex items-center mt-2">
                        <div className='flex-grow'>
                            <FormMessage />
                        </div>
                        <Link href="#" className="ml-auto inline-block text-sm text-primary/80 hover:text-primary hover:underline underline-offset-4">
                            Forgot password?
                        </Link>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full !mt-8 btn-liquid" size="lg">
                <span>Secure Login</span>
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account?{' '}</span>
            <Link href="#" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </div>
      </motion.div>
    </div>
  );
}
