import { Icon } from '@/components/Icon';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Phone from '@/components/Phone';
import Reviews from '@/components/Reviews';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, Check, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const featuresList = [
    {
      label: 'High-quality, durable material',
    },
    {
      label: '5 years print guarantee',
    },
    {
      label: 'Modern iPhone models supported',
    },
  ];
  const usersList = [
    {
      image: '/users/user-1.png',
    },
    {
      image: '/users/user-2.png',
    },
    {
      image: '/users/user-3.png',
    },
    {
      image: '/users/user-4.jpg',
    },
    {
      image: '/users/user-5.jpg',
    },
  ];
  const storeCons = [
    {
      label: 'High-quality silicone material',
    },
    {
      label: 'Scratch- and fingerprint resistant coating',
    },
    {
      label: 'Wirless charging compatible',
    },
    {
      label: '5 year print warranty',
    },
  ];

  const UserRating = ({ rating }: { rating: number }) => (
    <div className='flex gap-0.5 mb-2'>
      {Array.from({ length: rating }).map((_, key) => (
        <Star
          key={key}
          className='h-5 w-5 text-green-600 fill-green-600'
        />
      ))}
    </div>
  );

  const UserDetails = ({ userName }: { userName: string }) => (
    <div className='flex flex-col'>
      <p className='font-semibold'>{userName}</p>
      <div className='flex gap-1.5 items-center text-zinc-600'>
        <Check className='h-4 w-4 stroke-[3px] text-green-600' />
        <p className='text-sm'>Vefified Purchase</p>
      </div>
    </div>
  );
  return (
    <div className='bg-slate-50'>
      <section>
        <MaxWidthWrapper className='pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-3 lg:gap-x-0 lg:pt-32 lg:pb-52 xl:gap-x-8'>
          <div className='col-span-2 px-6 lg:px-0 lg:pt-4'>
            <div className='relative mx-auto text-center flex flex-col items-center lg:text-left lg:items-start'>
              <div className='absolute w-28 left-0 -top-20 hidden lg:block'>
                <img
                  src='/snake-1.png'
                  alt='logo'
                  className='w-full'
                />
              </div>
              <h1 className='relative w-ful tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl'>
                Your Image on a{' '}
                <span className='bg-green-600 px-2 text-white'>Custom</span>{' '}
                Phone Case
              </h1>
              <p className='mt-8 text-lg max-w-prose text-center text-balance md:text-wrap lg:pr-10 lg:text-left'>
                Capture your favotire memories with your own,{' '}
                <span>one-of-one</span> phone case. CaseCobra allows you to
                protect your memories, not just phone case.
              </p>

              <ul className='mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start'>
                <div className='space-y-2'>
                  {featuresList.map((item, key) => (
                    <li
                      key={key}
                      className='flex gap-1.5 items-center text-left'
                    >
                      <Check className='h-5 w-5 shrink-0 text-green-600' />
                      {item.label}
                    </li>
                  ))}
                </div>
              </ul>

              <div className='mt-12 flex flex-col items-center gap-5 sm:flex-row sm:items-start'>
                <div className='flex -space-x-4'>
                  {usersList.map((user, key) => (
                    <img
                      key={key}
                      src={user.image}
                      className='inline-block h-10 w-10 rounded-full ring-2 ring-slate-100 object-cover'
                      alt={`user ${key}`}
                    />
                  ))}
                </div>

                <div className='flex flex-col justify-between items-center sm:items-start'>
                  <div className='flex gap-0.5'>
                    {Array.from({ length: 5 }).map((_, key) => (
                      <Star
                        key={key}
                        className='h-4 w-4 text-green-600 fill-green-600'
                      />
                    ))}
                  </div>

                  <p>
                    <span className='font-semibold'>1.250</span> happy customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='col-span-full w-full h-fit flex justify-center px-8 mt-32 sm:px-16 md:px-0 lg:col-span-1 lg:mx-0 lg:mt-20'>
            <div className='relative md:max-w-xl'>
              <img
                width={52}
                height={52}
                src='/your-image.png'
                className='absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block'
                alt=''
              />
              <img
                width={20}
                height={20}
                src='/line.png'
                alt=''
                className='absolute w-20 -left-6 -bottom-6 select-none'
              />
              <Phone
                className='w-64'
                imgSrc='/testimonials/1.jpg'
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* value proposition section */}
      <section className='bg-slate-100 py-24'>
        <MaxWidthWrapper className='flex flex-col items-center gap-16 sm:gap-32'>
          <div className='flex flex-col lg:flex-row items-center gap-4 sm:gap-6'>
            <h2 className='order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900'>
              What our{' '}
              <span className='relative px-2'>
                customers
                <Icon.underline className='hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-green-500' />
              </span>
              say!
            </h2>
            <img
              src='/snake-2.png'
              alt=''
              className='w-24 order-0 lg:order-2'
            />
          </div>
          <div className='mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16'>
            {/* first user review*/}
            <div className='flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20'>
              <UserRating rating={5} />
              <div className='text-lg leading-8'>
                <p>
                  &quot;I usually keep my phone toghether with my keys in my
                  pocket and that led to some pretty heavy scratchmarks on all
                  of my last phone cases. This one, besides a barely noticeable
                  scratch on the corner,{' '}
                  <span className='p-0.5 bg-slate-800 text-white'>
                    looks brand new after about half a year
                  </span>
                  , I dig it&quot;
                </p>
              </div>
              <div className='flex gap-4 mt-2'>
                <img
                  src='/users/user-1.png'
                  alt='user'
                  className='rounded-full h-12 w-12 object-cover'
                />
                <UserDetails userName='Jonathan' />
              </div>
            </div>

            {/* second user review*/}
            <div className='flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20'>
              <UserRating rating={5} />
              <div className='text-lg leading-8'>
                <p>
                  &quot;The case feels durable and I even got a compliment on
                  the design. Had the case for two a half months now and{' '}
                  <span className='p-0.5 bg-slate-800 text-white'>
                    the image is super clear
                  </span>
                  , on the case I had before, the image started fading into
                  yello-ish color after a couple weeks. Love it.&quot;
                </p>
              </div>
              <div className='flex gap-4 mt-2'>
                <img
                  src='/users/user-4.jpg'
                  alt='user'
                  className='rounded-full h-12 w-12 object-cover'
                />
                <UserDetails userName='Josh' />
              </div>
            </div>
          </div>
        </MaxWidthWrapper>

        <div className='pt-16'>
          <Reviews />
        </div>
      </section>

      <section>
        <MaxWidthWrapper className='py-24'>
          <div className='mb-12 px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl sm:text-center'>
              <h2 className='order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900'>
                Upload your photo and get{' '}
                <span className='relative px-2 bg-green-600 text-white'>
                  your own case
                </span>{' '}
                now
              </h2>
            </div>
          </div>

          <div className='mx-auto max-w-6xl px-6 lg:px-8'>
            <div className='relative flex flex-col items-center md:grid grid-cols-2 gap-40'>
              <img
                src='/arrow.png'
                alt='arrow icon'
                className=' absolute top-[25rem] md:top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 rotate-90 md:rotate-0'
              />
              <div className='relative h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl'>
                <img
                  src='/horse.jpg'
                  alt='cover image'
                  className='rounded-md object-cover bg-white shaddow-2xl ring-1 ring-gray-900/10 h-full w-full'
                />
              </div>

              <Phone
                className='w-60'
                imgSrc='/horse_phone.jpg'
              />
            </div>
          </div>

          <ul className='mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit'>
            {storeCons.map((item, key) => (
              <li
                key={key}
                className='w-fit'
              >
                <Check className='h-5 text-green-600 inline mr-1.5' />
                {item.label}
              </li>
            ))}
            <div className='flex justify-center'>
              <Link
                href='/configure/upload'
                className={buttonVariants({
                  size: 'lg',
                  className: 'mx-auto mt-8',
                })}
              >
                Create your case now <ArrowRight className='h-4 w-4 ml-1.5' />
              </Link>
            </div>
          </ul>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
