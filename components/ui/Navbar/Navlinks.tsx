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
              <form onSubmit={(e) => handleRequest(e, SignOut)}>
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
}
