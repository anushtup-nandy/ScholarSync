import { User, UserRole, ResearchPost, Opportunity } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Dr. Elena Foster',
    role: UserRole.PROFESSOR,
    institution: 'MIT',
    interests: ['Climate Science', 'Oceanography', 'Data Analysis'],
    avatar: 'https://picsum.photos/seed/elena/200/200',
    bio: 'Looking for passionate students to work on coastal ecosystem resilience projects.',
    collaboratorScore: 920,
    socialLinks: {
      googleScholar: 'https://scholar.google.com',
      linkedin: 'https://linkedin.com',
      orcid: '0000-0001-2345-6789'
    }
  },
  {
    id: '2',
    name: 'James Chen',
    role: UserRole.STUDENT,
    institution: 'Stanford University',
    interests: ['Artificial Intelligence', 'Healthcare', 'Computer Vision'],
    avatar: 'https://picsum.photos/seed/james/200/200',
    bio: 'Developing AI models for early disease detection. Need mentorship on clinical trials.',
    collaboratorScore: 750,
    socialLinks: {
      linkedin: 'https://linkedin.com',
      website: 'https://jameschen.io'
    }
  },
  {
    id: '3',
    name: 'Sarah Ng',
    role: UserRole.RESEARCHER,
    institution: 'CERN',
    interests: ['Particle Physics', 'Quantum Computing'],
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    bio: 'Exploring quantum algorithms for high-energy physics simulations.',
    collaboratorScore: 880,
    socialLinks: {
      googleScholar: 'https://scholar.google.com',
      orcid: '0000-0002-9876-5432'
    }
  },
  {
    id: '4',
    name: 'Raj Patel',
    role: UserRole.ASPIRING,
    institution: 'Mumbai High School',
    interests: ['Sustainable Energy', 'Solar Cells'],
    avatar: 'https://picsum.photos/seed/raj/200/200',
    bio: 'High school senior working on perovskite solar cells. Seeking mentorship for Intel ISEF project.',
    collaboratorScore: 640,
    socialLinks: {
      linkedin: 'https://linkedin.com'
    }
  }
];

export const MOCK_POSTS: ResearchPost[] = [
  {
    id: '101',
    authorId: '2',
    authorName: 'James Chen',
    authorAvatar: 'https://picsum.photos/seed/james/100/100',
    title: 'AI in Radiology: Quick Update',
    description: 'Just achieved 95% accuracy on the new dataset! Here is a quick breakdown of the architecture used.',
    tags: ['AI', 'Healthcare', 'Milestone'],
    likes: 124,
  },
  {
    id: '102',
    authorId: '1',
    authorName: 'Dr. Elena Foster',
    authorAvatar: 'https://picsum.photos/seed/elena/100/100',
    title: 'The State of Coral Reefs',
    description: 'Field work update from the Great Barrier Reef. The bleaching events are accelerating.',
    tags: ['Climate', 'FieldWork'],
    likes: 890,
  },
  {
    id: '103',
    authorId: '4',
    authorName: 'Raj Patel',
    authorAvatar: 'https://picsum.photos/seed/raj/100/100',
    title: 'Lab Tour: Solar Simulator',
    description: 'Showing you around our new solar simulator setup at my school lab.',
    tags: ['LabLife', 'Energy'],
    likes: 45,
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '201',
    title: 'NSF Graduate Research Fellowship',
    institution: 'National Science Foundation',
    type: 'Grant',
    deadline: '2024-10-15',
    amount: '$34,000 / yr',
  },
  {
    id: '202',
    title: 'Postdoctoral Researcher in Neurobiology',
    institution: 'Harvard Medical School',
    type: 'Job',
    deadline: '2024-06-30',
    amount: 'Salary Competitive',
  },
  {
    id: '203',
    title: 'Call for Papers: Journal of Clean Energy',
    institution: 'Elsevier',
    type: 'Collaboration',
    deadline: '2024-08-01',
  }
];