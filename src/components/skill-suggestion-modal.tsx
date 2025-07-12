'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { suggestSkills, SkillSuggestionInput, SkillSuggestionOutput } from '@/ai/flows/skill-suggestion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Wand2 } from 'lucide-react';

interface SkillSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkills: SkillSuggestionInput;
  onApplySuggestions: (suggestions: SkillSuggestionOutput) => void;
}

export function SkillSuggestionModal({
  isOpen,
  onClose,
  currentSkills,
  onApplySuggestions,
}: SkillSuggestionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SkillSuggestionOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestSkills(currentSkills);
      setSuggestions(result);
    } catch (error) {
      console.error('Error generating skill suggestions:', error);
      toast({
        title: 'Error',
        description: 'Could not generate skill suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestions) {
      onApplySuggestions(suggestions);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Wand2 className="h-6 w-6 text-primary" />
            AI Skill Suggestions
          </DialogTitle>
          <DialogDescription>
            Let AI suggest some skills for you to offer and request based on your current profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {!suggestions && !isLoading && (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Click below to generate suggestions.</p>
                <Button onClick={handleGenerateSuggestions}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Suggestions
                </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Generating ideas...</p>
            </div>
          )}

          {suggestions && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Suggested Skills to Offer:</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.suggestedSkillsToOffer.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Suggested Skills to Request:</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.suggestedSkillsToRequest.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {suggestions && (
            <Button onClick={handleApply}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Apply Suggestions
            </Button>
          )}
          {!isLoading && suggestions && (
             <Button variant="outline" onClick={handleGenerateSuggestions}>
                <Wand2 className="mr-2 h-4 w-4" />
                Regenerate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
