'use client';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn, formatePrice } from '@/lib/utils';
import NextImage from 'next/image';
import { Rnd } from 'react-rnd';
import HandleComponent from '../../../components/HandleComponent';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Label as RadioLabel, Description, Radio, RadioGroup } from '@headlessui/react';
import { useRef, useState } from 'react';
import { COLORS, FINISHES, MATERIAL, MODELS } from '@/validators/option-validator';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react';
import { BASE_PRICE } from '@/config/products';
import { useUploadThing } from '@/lib/uploadthing';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { saveConfig as _saveConfig, SaveConfigArgs } from './action';
import { useRouter } from 'next/navigation';

interface DesignConfiguratorProps {
    configId: string;
    imageUrl: string;
    imageDimensions: { width: number; height: number };
}

const DesingConfigurator = ({ configId, imageUrl, imageDimensions }: DesignConfiguratorProps) => {
    const [options, setOptions] = useState<{
        color: (typeof COLORS)[number];
        model: (typeof MODELS.options)[number];
        material: (typeof MATERIAL.options)[number];
        finish: (typeof FINISHES.options)[number];
    }>({
        color: COLORS[0],
        model: MODELS.options[0],
        material: MATERIAL.options[0],
        finish: FINISHES.options[0],
    });

    const [renderedDimension, setRenderedDimension] = useState({
        width: imageDimensions.width / 4,
        height: imageDimensions.height / 4,
    });
    const [renderedPosition, setRenderedPosition] = useState({
        x: 150,
        y: 205,
    });
    const phoneCaseRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const { startUpload } = useUploadThing('imageUploader');
    const router = useRouter();

    // saveConfig function used to execute two funcitons in the same time (save cropped image, update db)
    const { mutate: saveConfig, isPending } = useMutation({
        mutationKey: ['save-confing'],
        mutationFn: async (args: SaveConfigArgs) => {
            await Promise.all([saveConfiguration(), _saveConfig(args)]);
        },
        onError: () =>
            toast({
                title: 'Something went wrong',
                description: 'There was an error on our end. Please try again.',
                variant: 'destructive',
            }),
        onSuccess: () => router.push(`/configure/preview?id=${configId}`),
    });

    async function saveConfiguration() {
        // if (!phoneCaseRef.current) return;
        try {
            const {
                left: caseLeft,
                top: caseTop,
                width,
                height,
            } = phoneCaseRef.current!.getBoundingClientRect();
            const { left: containerLeft, top: containerTop } =
                containerRef.current!.getBoundingClientRect();

            // calculate current position of our image
            const offsetLeft = caseLeft - containerLeft;
            const offsetTop = caseTop - containerTop;

            const actualX = renderedPosition.x - offsetLeft;
            const actualY = renderedPosition.y - offsetTop;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const cxt = canvas.getContext('2d');

            const userImage = new Image();
            userImage.crossOrigin = 'anonymos';
            userImage.src = imageUrl;
            await new Promise(resolve => (userImage.onload = resolve));
            cxt?.drawImage(
                userImage,
                actualX,
                actualY,
                renderedDimension.width,
                renderedDimension.height
            );

            const base64 = canvas.toDataURL();
            const base64Data = base64.split(',')[1];
            const blob = base64Blob(base64Data, 'image/png');
            const file = new File([blob], 'filename.png', { type: 'image/png' });

            await startUpload([file], { configId });
        } catch (err) {
            toast({
                title: `Somthing went wrong - ${err}`,
                description: 'Threre was a problem saving your config, please try again.',
                variant: 'destructive',
            });
        }
    }

    // blob -> take the mime type that we want to convert it. so it taking the original string and converting to bite array gives use the full flexablity to now make the MIM type out of this array
    function base64Blob(base64: string, mimeType: string) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
    return (
        <div className='relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20'>
            <div
                ref={containerRef}
                className='relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            >
                <div className='relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]'>
                    <AspectRatio
                        ref={phoneCaseRef}
                        ratio={896 / 1831}
                        className='pointer-events-none relative z-50 aspect-[896/1831] w-full'
                    >
                        <NextImage
                            fill
                            alt='phone image'
                            src='/phone-template.png'
                            className='pointer-events-none z-50 select-none'
                        />
                    </AspectRatio>

                    <div className='absolute z-40 inset-0 top-px right-[3px] bottom-px left-[3px] rounded-[32px] shadow-[0_0_0_9999px_rgba(229,231,235,0.6)]' />

                    <div
                        className={cn(
                            'absolute inset-0 top-px right-[3px] bottom-px left-[3px] rounded-[32px]',
                            `bg-${options.color.tw}`
                        )}
                    />
                </div>

                <Rnd
                    default={{
                        x: 150,
                        y: 205,
                        height: imageDimensions.height / 4,
                        width: imageDimensions.width / 4,
                    }}
                    onResizeStop={(_, __, ref, ___, { x, y }) => {
                        setRenderedDimension({
                            // slice -> 50px -> 50
                            height: parseInt(ref.style.height.slice(0, -2)),
                            width: parseInt(ref.style.width.slice(0, -2)),
                        });
                        setRenderedPosition({ x, y });
                    }}
                    onDragStop={(_, data) => {
                        const { x, y } = data;
                        setRenderedPosition({ x, y });
                    }}
                    className='absolute z-20 border-[3px] border-primary rounded-xl'
                    lockAspectRatio
                    resizeHandleComponent={{
                        bottomRight: <HandleComponent />,
                        bottomLeft: <HandleComponent />,
                        topLeft: <HandleComponent />,
                        topRight: <HandleComponent />,
                    }}
                >
                    <div className='relative w-full h-full'>
                        <NextImage
                            fill
                            alt='your image'
                            className='pointer-events-none rounded-xl'
                            src={imageUrl}
                        />
                    </div>
                </Rnd>
            </div>

            <div className='h-[37.5rem] col-span-full lg:col-span-1 flex flex-col bg-white'>
                <ScrollArea className='relative flex-1 overflow-auto'>
                    <div
                        aria-hidden='true'
                        className='absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none'
                    />

                    <div className='px-8 pb-12 pt-8'>
                        <h2 className='tracking-tight font-bold text-3xl'>Customize your case</h2>
                        {/* separator */}
                        <div className='w-full h-px bg-zinc-200 my-6' />
                        {/* colors */}
                        <div className='relative mt-4 h-full flex flex-col justify-between'>
                            <div className='flex flex-col gap-6'>
                                <RadioGroup
                                    value={options.color}
                                    onChange={value => {
                                        setOptions(prev => ({
                                            ...prev,
                                            color: value,
                                        }));
                                    }}
                                >
                                    <Label>Color: {options.color.label}</Label>

                                    <div className='mt-3 flex items-center space-x-3'>
                                        {COLORS.map(color => (
                                            <Radio
                                                key={color.label}
                                                value={color}
                                                className={({ focus, checked }) =>
                                                    cn(
                                                        'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                                                        {
                                                            [`border-${color.tw}`]:
                                                                focus || checked,
                                                        }
                                                    )
                                                }
                                            >
                                                <span
                                                    className={cn(
                                                        `bg-${color.tw}`,
                                                        'h-8 w-8 rounded-full border border-black border-opacity-10'
                                                    )}
                                                />
                                            </Radio>
                                        ))}
                                    </div>
                                </RadioGroup>

                                {/* modal */}
                                <div className='relative flex flex-col gap-3 w-full'>
                                    <Label>Modal</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant='outline'
                                                role='combobox'
                                                className='w-full justify-between'
                                            >
                                                {options.model.label}
                                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='w-full'>
                                            {MODELS.options.map(model => (
                                                <DropdownMenuItem
                                                    key={model.label}
                                                    className={cn(
                                                        'flex items-center gap-1 text-sm p-1.5 cursor-pointer hover:bg-zinc-100',
                                                        {
                                                            'bg-zinc-100':
                                                                model.label === options.model.label,
                                                        }
                                                    )}
                                                    onClick={() => {
                                                        setOptions(prev => ({
                                                            ...prev,
                                                            model,
                                                        }));
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            model.label === options.model.label
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                        )}
                                                    />
                                                    {model.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* materiales and finishes */}
                                {[MATERIAL, FINISHES].map(
                                    ({ name, options: selectableOptions }) => (
                                        <RadioGroup
                                            key={name}
                                            value={options[name]}
                                            onChange={value => {
                                                setOptions(prev => ({
                                                    ...prev,
                                                    [name]: value,
                                                }));
                                            }}
                                        >
                                            <Label>
                                                {name.slice(0, 1).toUpperCase() + name.slice(1)}
                                            </Label>
                                            <div className='mt-3 space-y-4'>
                                                {selectableOptions.map(option => (
                                                    <Radio
                                                        key={option.value}
                                                        value={option}
                                                        className={({ focus, checked }) =>
                                                            cn(
                                                                'relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between',
                                                                {
                                                                    'border-primary':
                                                                        focus || checked,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <span className='flex items-center'>
                                                            <span className='flex flex-col text-sm'>
                                                                <RadioLabel
                                                                    as='span'
                                                                    className='font-medium text-gray-900'
                                                                >
                                                                    {option.label}
                                                                </RadioLabel>

                                                                {option.description ? (
                                                                    <Description
                                                                        as='span'
                                                                        className='text-gray-500'
                                                                    >
                                                                        <span className='block sm:inline'>
                                                                            {option.description}
                                                                        </span>
                                                                    </Description>
                                                                ) : null}
                                                            </span>
                                                        </span>

                                                        <Description
                                                            as='span'
                                                            className='mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right'
                                                        >
                                                            <span className='font-medium text-gray-900'>
                                                                {formatePrice(option.price / 100)}
                                                            </span>
                                                        </Description>
                                                    </Radio>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className='w-full px-8 h-16 bg-white'>
                    <div className='h-px w-full bg-zinc-200' />
                    <div className='w-full h-full flex justify-end'>
                        <div className='w-full flex gap-6 items-center'>
                            <p className='font-medium whitespace-nowrap'>
                                {formatePrice(
                                    (BASE_PRICE + options.material.price + options.finish.price) /
                                        100
                                )}
                            </p>
                            <Button
                                size='sm'
                                className='w-full active:bg-green-700'
                                onClick={() =>
                                    saveConfig({
                                        configId,
                                        color: options.color.value,
                                        finish: options.finish.value,
                                        material: options.material.value,
                                        model: options.model.value,
                                    })
                                }
                                isLoading={isPending}
                                disabled={isPending}
                                loadingText='Saving'
                            >
                                Continue <ArrowRight className='h-4 w-4 ml-1.5' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DesingConfigurator;
