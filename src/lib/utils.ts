import { clsx, type ClassValue } from 'clsx';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export const formatePrice = (price: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return formatter.format(price);
};

export function constructMetadata({
    title = 'CaseCobra - custom hight quality phone cases',
    description = 'Create high-quality phone cases in seconds',
    image = '/thumbnails.png',
    icons = '/favicon.ico',
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
} = {}): Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: image }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@AhmedEb2000',
        },
        icons,
        metadataBase: new URL('https://casecobra-phi-six.vercel.app'),
    };
}
