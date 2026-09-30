'use client';

import { useState, useEffect, useCallback } from 'react';

const DEFAULT_COOLDOWN_SECONDS = 60;

export const useResendCooldown = (storageKey = 'verification_email') => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const getStorageItemKey = useCallback(() => {
    return `resend_cooldown_${storageKey}`;
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const key = getStorageItemKey();
      const savedExpiry = localStorage.getItem(key);
      if (savedExpiry) {
        const remaining = Math.ceil((parseInt(savedExpiry, 10) - Date.now()) / 1000);
        if (remaining > 0) {
          setSecondsLeft(remaining);
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // Ignore localStorage access issues if disabled in browser
    }
  }, [getStorageItemKey]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          try {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(getStorageItemKey());
            }
          } catch {
            // Ignore error
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, getStorageItemKey]);

  const startCooldown = useCallback((duration = DEFAULT_COOLDOWN_SECONDS) => {
    setSecondsLeft(duration);
    try {
      if (typeof window !== 'undefined') {
        const expiresAt = Date.now() + duration * 1000;
        localStorage.setItem(getStorageItemKey(), expiresAt.toString());
      }
    } catch {
      // Ignore error
    }
  }, [getStorageItemKey]);

  return {
    secondsLeft,
    isCooldownActive: secondsLeft > 0,
    startCooldown,
  };
};
