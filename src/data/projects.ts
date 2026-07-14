export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  icon: string
  screenshot: string
  links?: { label: string; url: string }[]
}

export const projects: Project[] = [
  {
    id: 'acnh-tracker',
    name: 'Animal Crossing Tracker',
    description:
      'This is a full-stack web application for tracking and managing your Animal Crossing ' +
      'Critterpedia. After tediously searching for what critters are currently available and' +
      ' trying to track them, I decided to build this as a way to help keep track of the creatures you\'ve collected.' +
      ' While more features are on the way, the current build allows for filtering for critters available at this exact moment' +
      ' and provides a simple way to log in to view your progress.',
    tech: ['React', 'TypeScript', 'AWS', 'DynamoDB', 'Amplify'],
    icon: '/assets/acnh-icon.png',
    screenshot: '/assets/acnh-screenshot.png',
    links: [{ label: 'GitHub', url: 'https://github.com/Justin-Meiners/animalcrossingtracker' }, {label: 'Live Site', url: 'https://acnhtracker.com'}],
  },
  {
    id: 'ticket-triage',
    name: 'Ticket Triage',
    description:
      'A full-stack web application for triaging and managing support tickets. This was built to ' +
      'help streamline the process of handling support requests and improve the overall efficiency of the support team. '+
      'The application allows the user to create new tickets while also providing a way to view and manage existing ones.',
    tech: ['React', 'Python', 'FastAPI', 'SQLite', 'OpenAI API'],
    icon: '/assets/triage-icon.png',
    screenshot: '',
    links: [{ label: 'GitHub', url: 'https://github.com/Justin-Meiners/ticket-triage' }],
  },
  {
    id: 'green-sight',
    name: 'Green Sight',
    description:
      'A full-stack web application for tracking pollution data and providing insights into environmental conditions in real-time.' +
      ' The application follows all Texas monitoring stations and provides real-time updates on pollution levels of various pollutants.' +
      ' Users can view the current pollution levels and are provided with information about the potential health impacts of each pollutant.' +
      ' The application is built with a modern stack, utilizing CI/CD pipelines for deployment and automated testing (both acceptance and unit tests).',
    tech: ['TypeScript', 'Flask', 'SQLAlchemy', 'Bootstrap', 'Docker', 'Python'],
    icon: '/assets/greensight-icon.png',
    screenshot: '/assets/greensight-screenshot.png',
    links: [{ label: 'GitHub', url: 'https://gitlab.com/azhang26/cs373-fall-2025-55085_11' }],
  },
]
