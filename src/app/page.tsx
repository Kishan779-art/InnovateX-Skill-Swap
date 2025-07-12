'use client';

import { useState, useMemo } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { UserCard } from '@/components/user-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Users } from 'lucide-react';

const USERS_PER_PAGE = 8;

export default function Home() {
  const [users] = useState<User[]>(mockUsers.filter(u => u.profileStatus === 'public'));
  const [skillSearch, setSkillSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSkill = skillSearch.trim() === '' || 
        user.skillsOffered.some(skill => skill.toLowerCase().includes(skillSearch.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()));
      
      const matchesAvailability = availabilityFilter === 'all' || user.availability.toLowerCase() === availabilityFilter;

      return matchesSkill && matchesAvailability;
    });
  }, [users, skillSearch, availabilityFilter]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Connect & Grow
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Discover talented individuals, exchange skills, and build your network.
        </p>
      </div>

      <div className="p-6 bg-card rounded-lg shadow-lg border animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="skill-search" className="block text-sm font-medium text-foreground mb-1">Search by skill</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="skill-search"
                type="text"
                placeholder="e.g., Web Development, Graphic Design..."
                value={skillSearch}
                onChange={(e) => {
                  setSkillSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-foreground mb-1">Availability</label>
            <Select 
              value={availabilityFilter} 
              onValueChange={(value) => {
                setAvailabilityFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="availability">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="evenings">Evenings</SelectItem>
                <SelectItem value="weekdays">Weekdays</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {paginatedUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedUsers.map((user, index) => (
              <div
                key={user.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.05}s`, animationFillMode: 'both' }}
              >
                <UserCard user={user} />
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 animate-fade-in">
            <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="liquid">
              <span>Previous</span>
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="liquid">
              <span>Next</span>
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-16 animate-fade-in">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Users Found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
}
