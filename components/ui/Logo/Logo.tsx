import { League_Spartan } from 'next/font/google';

const LogoFont = League_Spartan({weight: '800'})

const Logo = ({ ...props }) => (

  <span {...props}>poddiy</span>

);

export default Logo;
