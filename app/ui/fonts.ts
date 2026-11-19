import { Bricolage_Grotesque, Be_Vietnam_Pro } from 'next/font/google';

export const bricolageDisplay = Bricolage_Grotesque({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
});

export const beVietnamBody = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
});
