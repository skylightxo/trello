import { Statuses } from '../enums/statuses';

export const statusToRepresentationMap = {
  [Statuses.Backlog]: {
    status: Statuses.Backlog,
    name: 'Backlog (Open)',
    icon: '⭕️',
    bg_color: '#7c888e',
    header_color: '#9baab2',
  },
  [Statuses.Selected]: {
    status: Statuses.Selected,
    name: 'Selected',
    icon: '🔆️',
    bg_color: '#c7aa38',
    header_color: '#f9d648',
  },
  [Statuses.Running]: {
    status: Statuses.Running,
    name: 'Running',
    icon: '⚙️',
    bg_color: '#a13744',
    header_color: '#ca4554',
  },
  [Statuses.Evaluating]: {
    status: Statuses.Evaluating,
    name: 'Evaluating',
    icon: '📝',
    bg_color: '#3887c6',
    header_color: '#48a9f8',
  },
  [Statuses.Live]: {
    status: Statuses.Live,
    name: 'Live',
    icon: '✅',
    bg_color: '#79a149',
    header_color: '#98ca5b',
  },
};
