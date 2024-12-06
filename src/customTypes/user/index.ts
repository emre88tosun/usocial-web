export type User = {
  id: number;
  name: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  gem_data?: {
    id: number;
    amount?: number;
  };
};
