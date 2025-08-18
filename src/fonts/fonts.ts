import { Montserrat, Open_Sans, Poppins } from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '100', '500'],
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '600'],
});
