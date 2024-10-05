'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAuthStatus } from './action';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const Page = () => {
    const [configId, setConfigId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // fixed error id null via local storage properties
        const storedData = localStorage.getItem('configurationId');
        const configurationId = storedData ? JSON.parse(storedData) : null;

        if (configurationId) setConfigId(configurationId);
    }, []);

    const { data } = useQuery({
        queryKey: ['auth-callback'],
        queryFn: async () => await getAuthStatus(),
        retry: true, // if user dosn't have id or email keep retrying to call queryFn() every 500ms untill the user in db
        retryDelay: 500,
    });
    if (data?.success) {
        if (configId) {
            localStorage.removeItem('configurationId'); // before router because URL going to change
            router.push(`configure/preview?id=${configId}`);
        } else {
            router.push('/');
        }
    }

    return (
        <div className='w-full mt-24 flex justify-center'>
            <div className='flex flex-col items-center pag-2'>
                <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
                <h3 className='font-semibold text-xl'>Loggin you in...</h3>
                <p>Your will be automatically.</p>
            </div>
        </div>
    );
};
export default Page;
