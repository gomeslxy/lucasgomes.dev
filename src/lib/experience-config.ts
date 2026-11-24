/** Shared art direction. Durations are milliseconds; pointer angles are degrees. */
export const experienceConfig = {
  intro: {
    minimumMs: 220,
    mobileMinimumMs: 140,
    maximumMs: 900,
    mobileMaximumMs: 600,
    exitMs: 440,
    mobileExitMs: 280,
    handoffDelayMs: 70,
    mobileHandoffDelayMs: 35,
  },
  pointer: {
    maxTiltX: 0.6,
    maxTiltY: 0.8,
    lightOpacity: 0.28,
  },
  spring: { stiffness: 110, damping: 28, mass: 0.65 },
  atmosphere: {
    particleCount: 12,
    mobileParticleCount: 4,
    cycleSeconds: 22,
    glowOpacity: 0.36,
  },
} as const;
