import { constructMetadata } from '@/lib/utils';
import { ReactNode } from 'react';
export const metadata = constructMetadata({ title: 'Upload your photo' });

const Layout = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};
export default Layout;
