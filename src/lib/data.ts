import type { User, Swap, Feedback } from './types';

export const mockFeedback: Feedback[] = [
  { id: 'f1', swapId: 's1', reviewerId: 'u2', reviewedId: 'u1', rating: 5, comment: 'Amazing collaboration! Very knowledgeable.' },
  { id: 'f2', swapId: 's2', reviewerId: 'u3', reviewedId: 'u1', rating: 4, comment: 'Great to work with, very responsive.' },
  { id: 'f3', swapId: 's3', reviewerId: 'u1', reviewedId: 'u2', rating: 5, comment: 'Learned a lot about pottery. Highly recommend!' },
  { id: 'f4', swapId: 's4', reviewerId: 'u4', reviewedId: 'u3', rating: 5, comment: 'Fantastic baker and a great teacher.'},
  { id: 'f5', swapId: 's5', reviewerId: 'u5', reviewedId: 'u4', rating: 4, comment: 'Helpful with my marketing strategy.'},
  { id: 'f6', swapId: 's6', reviewerId: 'u1', reviewedId: 'u5', rating: 5, comment: 'Excellent guitar lessons.'},
  { id: 'f7', swapId: 's7', reviewerId: 'u6', reviewedId: 'u2', rating: 3, comment: 'Good, but scheduling was a bit difficult.'},
  { id: 'f8', swapId: 's8', reviewerId: 'u2', reviewedId: 'u6', rating: 5, comment: 'The best yoga instructor!'},
];

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'woman portrait',
    location: 'San Francisco, CA',
    skillsOffered: ['Web Development', 'React', 'Node.js'],
    skillsWanted: ['Graphic Design', 'Pottery'],
    availability: 'evenings',
    profileStatus: 'public',
    feedback: mockFeedback.filter(f => f.reviewedId === 'u1')
  },
  {
    id: 'u2',
    name: 'Bob Williams',
    email: 'bob@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'man portrait',
    location: 'New York, NY',
    skillsOffered: ['Graphic Design', 'Illustration', 'Logo Design'],
    skillsWanted: ['Web Development', 'Yoga'],
    availability: 'weekends',
    profileStatus: 'public',
    feedback: mockFeedback.filter(f => f.reviewedId === 'u2')
  },
  {
    id: 'u3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'person smiling',
    location: 'Chicago, IL',
    skillsOffered: ['Creative Writing', 'Baking', 'Content Creation'],
    skillsWanted: ['Photography', 'Marketing'],
    availability: 'weekdays',
    profileStatus: 'public',
    feedback: mockFeedback.filter(f => f.reviewedId === 'u3')
  },
  {
    id: 'u4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'woman professional',
    location: 'Austin, TX',
    skillsOffered: ['Marketing Strategy', 'SEO', 'Social Media'],
    skillsWanted: ['Baking', 'Public Speaking'],
    availability: 'evenings',
    profileStatus: 'public',
    feedback: mockFeedback.filter(f => f.reviewedId === 'u4')
  },
  {
    id: 'u5',
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'man action',
    location: 'Miami, FL',
    skillsOffered: ['Guitar Lessons', 'Music Production', 'Songwriting'],
    skillsWanted: ['Web Development', 'Cooking'],
    availability: 'weekends',
    profileStatus: 'public',
    feedback: mockFeedback.filter(f => f.reviewedId === 'u5')
  },
  {
    id: 'u6',
    name: 'Fiona Glenanne',
    email: 'fiona@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'woman serious',
    location: 'Los Angeles, CA',
    skillsOffered: ['Yoga Instruction', 'Meditation', 'Fitness Coaching'],
    skillsWanted: ['Graphic Design', 'Gardening'],
    availability: 'weekdays',
    profileStatus: 'public',
    feedback: mockFeedback.filter(f => f.reviewedId === 'u6')
  },
   {
    id: 'u7',
    name: 'George Costanza',
    email: 'george@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'man thinking',
    location: 'New York, NY',
    skillsOffered: ['Architecture', 'Urban Planning'],
    skillsWanted: ['Latex Sales', 'Hand-modeling'],
    availability: 'evenings',
    profileStatus: 'private', // This user should not appear on the home page
    feedback: []
  },
  {
    id: 'u8',
    name: 'Hannah Montana',
    email: 'hannah@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'woman singing',
    location: 'Malibu, CA',
    skillsOffered: ['Singing', 'Stage Performance'],
    skillsWanted: ['Normal Life', 'Disguise'],
    availability: 'weekends',
    profileStatus: 'public',
    feedback: []
  },
  {
    id: 'u9',
    name: 'Ian Malcolm',
    email: 'ian@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'man scientist',
    location: 'Isla Nublar',
    skillsOffered: ['Chaos Theory', 'Witty Repartee'],
    skillsWanted: ['Dinosaur Taming', 'Helicopter Piloting'],
    availability: 'weekends',
    profileStatus: 'public',
    feedback: []
  },
  {
    id: 'u10',
    name: 'Jane Smith',
    email: 'jane@example.com',
    profilePhotoUrl: 'https://placehold.co/128x128.png',
    data_ai_hint: 'woman smiling',
    location: 'Seattle, WA',
    skillsOffered: ['Data Analysis', 'Python', 'Machine Learning'],
    skillsWanted: ['Project Management', 'Public Speaking'],
    availability: 'weekdays',
    profileStatus: 'public',
    feedback: []
  },
];


export const mockSwaps: Swap[] = [
    { id: 's1', requesterId: 'u2', requesterName: 'Bob Williams', responderId: 'u1', responderName: 'Alice Johnson', offeredSkill: 'Graphic Design', wantedSkill: 'Web Development', message: 'Hey Alice, I can help with your branding if you can build a portfolio site for me.', status: 'completed', createdAt: new Date('2023-10-01') },
    { id: 's2', requesterId: 'u3', requesterName: 'Charlie Brown', responderId: 'u1', responderName: 'Alice Johnson', offeredSkill: 'Baking', wantedSkill: 'Web Development', message: 'I can bake you the best cookies for a week for some help on my blog.', status: 'accepted', createdAt: new Date('2023-10-15') },
    { id: 's3', requesterId: 'u1', requesterName: 'Alice Johnson', responderId: 'u2', responderName: 'Bob Williams', offeredSkill: 'React', wantedSkill: 'Pottery', message: 'Looking to learn pottery, can teach you React in exchange!', status: 'pending', createdAt: new Date('2023-10-20') },
    { id: 's4', requesterId: 'u4', requesterName: 'Diana Prince', responderId: 'u3', responderName: 'Charlie Brown', offeredSkill: 'SEO', wantedSkill: 'Baking', message: 'I will get your food blog to the first page of Google for some sourdough lessons.', status: 'rejected', createdAt: new Date('2023-09-25') },
    { id: 's5', requesterId: 'u5', requesterName: 'Ethan Hunt', responderId: 'u4', responderName: 'Diana Prince', offeredSkill: 'Guitar Lessons', wantedSkill: 'Marketing Strategy', message: 'Need help marketing my new album. Can teach you guitar.', status: 'pending', createdAt: new Date('2023-10-22') },
    { id: 's6', requesterId: 'u1', requesterName: 'Alice Johnson', responderId: 'u5', responderName: 'Ethan Hunt', offeredSkill: 'Node.js', wantedSkill: 'Guitar Lessons', message: 'Hi Ethan, I\'m a developer who would love to learn guitar. Can help with backend work.', status: 'accepted', createdAt: new Date('2023-10-18') },
    { id: 's7', requesterId: 'u6', requesterName: 'Fiona Glenanne', responderId: 'u2', responderName: 'Bob Williams', offeredSkill: 'Yoga Instruction', wantedSkill: 'Illustration', message: 'Can offer private yoga sessions for some custom illustrations for my studio.', status: 'completed', createdAt: new Date('2023-08-15') },
    { id: 's8', requesterId: 'u2', requesterName: 'Bob Williams', responderId: 'u6', responderName: 'Fiona Glenanne', offeredSkill: 'Logo Design', wantedSkill: 'Yoga Instruction', message: 'Hi Fiona, I can design a new logo for your yoga business in exchange for a few classes.', status: 'pending', createdAt: new Date('2023-10-21') },
];
