import { App } from 'obsidian';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useApp = (): App | undefined => {
  return useContext(AppContext);
};