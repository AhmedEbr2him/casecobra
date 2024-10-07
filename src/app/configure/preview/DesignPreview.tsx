'use client';
import Confetti from 'react-dom-confetti';
import { useState, useEffect } from 'react';
import Phone from '@/components/Phone';
import { Configuration } from '@prisma/client';
import { COLORS, MODELS } from '@/validators/option-validator';
import { cn, formatePrice } from '@/lib/utils';
import { ArrowRight, Check } from 'lucide-react';
import { BASE_PRICE, PRODUCT_PRICE } from '@/config/products';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { createCheckoutSession } from './action';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'; // we on client side not server
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import LoginModal from '@/components/LoginModal';

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useKindeBrowserClient();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const { id } = configuration;
    const { color, croppedImageUrl, model, finish, material } = configuration;
    const [showConfetti, setShowConfetti] = useState(false);

    const tw = COLORS.find(supportedColor => supportedColor.value === color)?.tw;
    const { label: modelLabel } = MODELS.options.find(({ value }) => value === model)!;

    useEffect(() => setShowConfetti(true), []);

    let totalPrice = BASE_PRICE;
    if (material === 'polycarbonate') totalPrice += PRODUCT_PRICE.material.polycarbonate;
    if (finish === 'textured') totalPrice += PRODUCT_PRICE.finish.texture;

    const { mutate: createPaymentSession, isPending } = useMutation({
        mutationKey: ['get-checkout-session'],
        mutationFn: createCheckoutSession,
        onSuccess: ({ url }) => {
            if (url) router.push(url);
            else throw new Error('Unable to retrive payment URL.');
        },
        onError: () => {
            toast({
                title: 'Oops something went wrong!',
                description: 'There was an error on our end. Please try again.',
                variant: 'destructive',
            });
        },
    });

    // ensuring the user is log in
    const handleCheckout = () => {
        if (user) {
            // create payment session
            createPaymentSession({ configId: id });
        } else {
            // need to log in
            // fixed error id null via local storage properties
            localStorage.setItem('configurationId', JSON.stringify(id));
            setIsLoginModalOpen(true);
        }
    };
    return (
        <>
            <div
                aria-hidden='true'
                className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'
            >
                <Confetti
                    active={showConfetti}
                    config={{ elementCount: 1000, spread: 150, duration: 5000 }}
                />
            </div>
            {/* login modal */}
            <LoginModal
                setIsOpen={setIsLoginModalOpen}
                isOpen={isLoginModalOpen}
            />

            <div className='mt-20 text-sm grid grid-cols-1 sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12'>
                <div className='sm:col-span-3 md:row-span-2 md:row-end-2'>
                    <Phone
                        imgSrc={croppedImageUrl!}
                        className={cn(`bg-${tw}`)}
                    />
                </div>

                <div className='mt-6 sm:col-span-9 sm:mt-0 md:row-end-1'>
                    <h3 className='text-3xl font-bold tracking-tight text-gray-900'>
                        Your {modelLabel} Case
                    </h3>
                    <div className='mt-3 flex items-center gap-1.5 text-base'>
                        <Check className='h-4 w-4 text-green-500' />
                        In stock and ready to shipping!
                    </div>
                </div>

                <div className='sm:col-span-12 md:col-span-9 text-base'>
                    <div className='grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10'>
                        <div>
                            <p className='font-medium text-zinc-950'>Highlights</p>
                            <ol className='ol_list'>
                                <li>Wireless charging compatible</li>
                                <li>TPU shock absorption</li>
                                <li>Packing made from recycled materials</li>
                                <li>5 years print warranty</li>
                            </ol>
                        </div>
                        <div>
                            <p className='font-medium text-zinc-950'>Materials</p>
                            <ol className='ol_list'>
                                <li>High quality, durable material</li>
                                <li>Scratch- and fingerprint resistant config</li>
                            </ol>
                        </div>
                    </div>
                    {/* price */}
                    <div className='mt-8'>
                        <div className='bg-gray-50 p-6 sm:rounded-lg sm:p-8'>
                            <div className='flow-root text-sm'>
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Base price</p>
                                    <p className='font-medium text-gray-900'>
                                        {formatePrice(BASE_PRICE / 100)}
                                    </p>
                                </div>

                                {finish === 'textured' ? (
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                        <p className='text-gray-600'>Textured finish</p>
                                        <p className='font-medium text-gray-900'>
                                            {formatePrice(PRODUCT_PRICE.finish.texture / 100)}
                                        </p>
                                    </div>
                                ) : null}
                                {material === 'polycarbonate' ? (
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                        <p className='text-gray-600'>Soft polycarbonate material</p>
                                        <p className='font-medium text-gray-900'>
                                            {formatePrice(
                                                PRODUCT_PRICE.material.polycarbonate / 100
                                            )}
                                        </p>
                                    </div>
                                ) : null}
                                <div className='my-2 h-px bg-gray-200' />
                                <div className='flex items-center justify-between py-2'>
                                    <p className='font-semibold text-gray-900'>Order total</p>
                                    <p className='font-semibold text-grayp-900'>
                                        {formatePrice(totalPrice / 100)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-8 flex justify-end pb-12'>
                            <Button
                                className='px-4 sm:px-6 lg:px-8 active:bg-green-600'
                                onClick={() => handleCheckout()}
                                isLoading={isPending}
                                disabled={isPending}
                                loadingText='Loading'
                            >
                                Check out <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default DesignPreview;
