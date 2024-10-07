import { constructMetadata } from '@/lib/utils';
import { ReactNode } from 'react';
export const metadata = constructMetadata({ title: 'Admin Dashboard' });

const Layout = ({ children }: { children: ReactNode }) => {
    return <div>{children}</div>;
};
export default Layout;
