import { ASSETS } from '../constants/assets';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'María González',
    role: 'Lead Developer',
    bio: 'Passionate about creating solutions that improve education and transportation safety for students.',
    image: ASSETS.team.member1,
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    role: 'Backend Engineer',
    bio: 'Specialized in building secure and scalable systems for real-time tracking and data management.',
    image: ASSETS.team.member2,
  },
  {
    id: '3',
    name: 'Ana Martínez',
    role: 'UI/UX Designer',
    bio: 'Focused on creating intuitive and accessible interfaces that serve all members of our community.',
    image: ASSETS.team.member3,
  },
  {
    id: '4',
    name: 'Luis Pérez',
    role: 'Project Manager',
    bio: 'Dedicated to ensuring Traeme meets the needs of Politécnico Reverendo Andrés Amengual Fe y Alegría.',
    image: ASSETS.team.member4,
  },
];
