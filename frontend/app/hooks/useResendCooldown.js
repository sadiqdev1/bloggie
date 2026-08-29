import { useState, useEffect, useRef } from 'react';

/**
 * useResendCooldown — prevents spamming resend buttons.
 *
 * @param {number} seconds  Cooldown duration in seconds (default 90)
 * @returns {{ cooldown, startCooldown, label }}
 *   cooldown      - seconds remaining (0 = ready to send again)
 *   startCooldown - call this right after a successful send
 *   label         - e.g. "Resend" | "Resend in 1:23"
 */
export default function useResendCooldown(seconds = 90) {
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  function startCooldown() {
    setCooldown(seconds);
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const mins = Math.floor(cooldown / 60);
  const secs = String(cooldown % 60).padStart(2, '0');
  const label = cooldown > 0 ? `Resend in ${mins}:${secs}` : 'Resend';

  return { cooldown, startCooldown, label };
}
