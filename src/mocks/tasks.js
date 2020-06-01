import { Statuses } from '../enums/statuses';

export const tasks = [
  {
    id: 1,
    status: Statuses.Backlog,
    tags: [1],
    title: 'Human Interest Form',
    description: 'Fill out human interest distribution form',
    position: 0,
  },
  {
    id: 2,
    tags: [1],
    status: Statuses.Backlog,
    title: 'Purchase present',
    description: 'Get an anniversary gift',
    position: 1,
  },

  {
    id: 3,
    tags: [2, 3],
    status: Statuses.Backlog,
    title: 'Invest in investments',
    description: 'Call the bank to talk about investments',
    position: 2,
  },
  {
    id: 4,
    tags: [],
    status: Statuses.Backlog,
    title: 'Daily reading',
    description: 'Finish reading Intro to UI/UX',
    position: 3,
  },
  {
    id: 5,
    tags: [],
    status: Statuses.Backlog,
    title: 'Love Yourself',
    description: '',
    position: 4,
  },
];
