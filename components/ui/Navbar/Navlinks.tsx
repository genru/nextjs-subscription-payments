'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { League_Spartan } from 'next/font/google'

import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}
const LogoFont = League_Spartan({weight: '800', subsets: ['latin']})

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  return (
    <div className="d-navbar bg-base-100">
      <div className="flex-1">
        {/* <a className="d-btn d-btn-ghost text-xl"> */}
        <Link href="/" className="d-btn d-btn-ghost hover:bg-transparent" aria-label="Logo">
          <span className={LogoFont.className+' '+'text-3xl tracking-tight hover:tracking-normal'}>
            poddiy
          </span>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="d-menu d-menu-horizontal px-1">
          {user && <li>
            <Link href="/feeds" >
              My Feeds
            </Link>
          </li>}
          <li>
          <Link href="/pricing" >
            Pricing
          </Link>
          </li>
          {user && (
          <li>
          <Link href="/account">
              Account
            </Link>
            </li>
          )}

          <li>
            {user ? (
              <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
                <input type="hidden" name="pathName" value={usePathname()} />
                <button type="submit">
                  Sign out
                </button>
              </form>
            ) : (
              <Link href="/signin">
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  )
  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
        <nav className="ml-6 space-x-2 lg:block">
          <Link href="/pricing" className={s.link}>
            Pricing
          </Link>
          {user && (
            <Link href="/account" className={s.link}>
              Account
            </Link>
          )}
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={usePathname()} />
            <button type="submit" className={s.link}>
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
