'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface TimezoneCtx {
  tz: string;
  label: string;
}

const Ctx = createContext<TimezoneCtx>({ tz: 'UTC', label: 'UTC' });

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [tz, setTz] = useState('UTC');

  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const label = useMemo(() => {
    try {
      return (
        new Intl.DateTimeFormat('en', { timeZoneName: 'short', timeZone: tz })
          .formatToParts(new Date())
          .find((p) => p.type === 'timeZoneName')?.value ?? tz
      );
    } catch {
      return tz;
    }
  }, [tz]);

  return <Ctx.Provider value={{ tz, label }}>{children}</Ctx.Provider>;
}

export function useTimezone() {
  return useContext(Ctx);
}
