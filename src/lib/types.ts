export interface User {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl: string;
  data_ai_hint?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: 'weekends' | 'evenings' | 'weekdays' | string;
  profileStatus: 'public' | 'private';
  feedback?: Feedback[];
}

export interface Swap {
  id: string;
  requesterId: string;
  responderId: string;
  offeredSkill: string;
  wantedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'deleted';
  createdAt: Date;
}

export interface Feedback {
  id: string;
  swapId: string;
  reviewerId: string;
  reviewedId: string;
  rating: number; // 1-5
  comment: string;
}
