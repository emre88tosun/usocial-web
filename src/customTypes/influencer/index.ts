import { User } from '@customTypes/user';

export type BecomeInfluencerBody = {
  bio: string;
  gem_cost_per_dm: number;
};

export type Influencer = {
  id: number;
  user_id: number;
  user?: User;
  bio: string;
  gem_cost_per_dm: number;
};
