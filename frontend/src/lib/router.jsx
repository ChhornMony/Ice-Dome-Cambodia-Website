"use client";

import Link from 'next/link';
import { usePathname, useRouter, useParams as useNextParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const STATE_PREFIX = 'next-router-state:';

function saveRouteState(path, state) {
  if (typeof window === 'undefined' || !state) return;
  try {
    sessionStorage.setItem(`${STATE_PREFIX}${path}`, JSON.stringify(state));
  } catch {
    // Ignore storage errors.
  }
}

function readRouteState(path) {
  if (typeof window === 'undefined') return undefined;
  try {
    const stored = sessionStorage.getItem(`${STATE_PREFIX}${path}`);
    return stored ? JSON.parse(stored) : undefined;
  } catch {
    return undefined;
  }
}

export function useNavigate() {
  const router = useRouter();

  return (to, options = {}) => {
    if (typeof to === 'number') {
      if (to === -1) router.back();
      return;
    }

    if (options?.state) saveRouteState(to, options.state);
    router.push(to);
  };
}

export function useLocation() {
  const pathname = usePathname();
  const [state, setState] = useState(undefined);

  useEffect(() => {
    setState(readRouteState(pathname));
  }, [pathname]);

  return useMemo(() => ({ pathname, state }), [pathname, state]);
}

export function useParams() {
  return useNextParams();
}

export function NavLink({ to, className, children, ...props }) {
  const pathname = usePathname();
  const isActive = pathname === to;
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;
  const resolvedChildren = typeof children === 'function' ? children({ isActive }) : children;

  return (
    <Link href={to} className={resolvedClassName} {...props}>
      {resolvedChildren}
    </Link>
  );
}

export { Link };
