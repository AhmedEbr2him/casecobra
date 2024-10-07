import { constructMetadata } from '@/lib/utils';
import { ReactNode } from 'react';
export const metadata = constructMetadata({ title: 'Summary of order' });

const Layout = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};
export default Layout;
