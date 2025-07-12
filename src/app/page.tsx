'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { UserCard } from '@/components/user-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Users } from 'lucide-react';
import { RequestSwapModal } from '@/components/request-swap-modal';
import { UserCardSkeleton } from '@/components/user-card-skeleton';

const USERS_PER_PAGE = 8;
const MOCK_CURRENT_USER_ID = 'u1';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [skillSearch, setSkillSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // Simulate data fetching
    setTimeout(() => {
      const publicUsers = mockUsers.filter(u => u.profileStatus === 'public');
      setUsers(publicUsers);
      const user = mockUsers.find(u => u.id === MOCK_CURRENT_USER_ID);
      if (user) {
        setCurrentUser(user);
      }
      setIsLoading(false);
    }, 1500);
  }, []);


  const handleRequestSwap = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (user.id === MOCK_CURRENT_USER_ID) return false;
      
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
    <>
      <div className="space-y-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-headline font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Connect & Grow
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover talented individuals, exchange skills, and build your network.
          </p>
        </motion.div>

        <motion.div 
          className="p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: USERS_PER_PAGE }).map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </div>
        ) : paginatedUsers.length > 0 ? (
          <>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {paginatedUsers.map((user) => (
                <motion.div
                  key={user.id}
                  variants={itemVariants}
                >
                  <UserCard user={user} onRequestSwap={handleRequestSwap} />
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
              className="flex justify-center items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Users Found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search filters.</p>
          </motion.div>
        )}
      </div>
       {currentUser && selectedUser && (
        <RequestSwapModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentUser={currentUser}
          targetUser={selectedUser}
        />
      )}
    </>
  );
}
