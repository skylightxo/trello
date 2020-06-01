import { createContext } from 'react';

export const AppContext = createContext({ updateColumns: async () => {}, searchTasksByString: async () => {} });
