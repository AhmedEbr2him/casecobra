import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}
const Phone = ({ className, imgSrc, dark = false, ...props }: PhoneProps) => {
  return (
    <div className={cn('relative pointer-events-none z-50 overflow-hidden', className)} {...props}>
      <img
        src={dark ? '/phone-template-dark-edges.png' : '/phone-template-white-edges.png'}
        alt='phone image'
        className='pointer-events-none select-none z-50'
      />
      <div className='absolute -z-10 inset-0'>
        <img src={imgSrc} alt='overlay phone image' className='object-cover' />
      </div>
    </div>
  );
};
export default Phone;
