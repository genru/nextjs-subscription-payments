import { League_Spartan } from 'next/font/google';

const LogoFont = League_Spartan({weight: '800', subsets: ['latin']})

const Logo = ({ ...props }) => (

  <span className={LogoFont.className + ' '+'text-2xl'}>poddiy</span>

);

export default Logo;
