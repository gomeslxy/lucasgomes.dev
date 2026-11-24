/** Shared art direction. Durations are milliseconds; pointer angles are degrees. */
export const experienceConfig = {
  intro: {
    minimumMs: 260,
    mobileMinimumMs: 180,
    maximumMs: 1600,
    mobileMaximumMs: 1000,
    exitMs: 560,
    mobileExitMs: 360,
    handoffDelayMs: 110,
    mobileHandoffDelayMs: 60,
  },
  pointer: {
    maxTiltX: .6,
    maxTiltY: .8,
    lightOpacity: .28,
  },
  spring: { stiffness: 110, damping: 28, mass: .65 },
  atmosphere: {
    particleCount: 12,
    mobileParticleCount: 4,
    cycleSeconds: 22,
    glowOpacity: .36,
  },
} as const;
