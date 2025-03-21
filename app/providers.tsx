'use client';

import { Provider } from 'react-redux';
import store from '@/app/redux/store/index';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
