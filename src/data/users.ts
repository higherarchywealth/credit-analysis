import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sjohnson@bankdemo.com',
    role: 'analyst',
    avatar: undefined,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@bankdemo.com',
    role: 'admin',
    avatar: undefined,
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'edavis@bankdemo.com',
    role: 'reviewer',
    avatar: undefined,
  },
];

export const currentUser: User = mockUsers[0];
