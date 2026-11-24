import { experienceConfig } from "@/lib/experience-config";

export const INTRO_SESSION_KEY = "lucas:portfolio-intro:v4";

/**
 * Generates the synchronous <head> bootstrap script so `data-intro-phase`
 * is resolved before first paint, preventing hydration flash or FOUC.
 */
export function getIntroBootstrapScript(): string {
  const timings = JSON.stringify(experienceConfig.intro);
  return `/* Desenvolvido por Lucas Gomes (@gomeslxy) • Indaiatuba, SP | la181009@gmail.com */(function(){try{var r=document.documentElement,c=${timings},m=matchMedia('(max-width: 767px), (pointer: coarse)').matches,n=performance.getEntriesByType('navigation')[0],seen=false;try{seen=sessionStorage.getItem('${INTRO_SESSION_KEY}')==='seen'}catch(e){}var isReload=n&&n.type==='reload';var conn=navigator.connection;var slowNet=!!(conn&&(conn.saveData||/^(slow-)?2g|3g$/.test(conn.effectiveType||'')));var skip=matchMedia('(prefers-reduced-motion: reduce)').matches||!!location.hash||document.hidden||slowNet||(seen&&!isReload)||(n&&n.type==='back_forward');var exitMs=m?c.mobileExitMs:c.exitMs;var maxMs=m?c.mobileMaximumMs:c.maximumMs;var handoffDelayMs=skip?0:(m?c.mobileHandoffDelayMs:c.handoffDelayMs);r.dataset.introPhase=skip?'ready':'loading';r.style.setProperty('--intro-exit-ms',exitMs+'ms');r.style.setProperty('--intro-max-ms',maxMs+'ms');r.style.setProperty('--intro-handoff-delay',handoffDelayMs+'ms');var state={startedAt:performance.now(),skip:!!skip,timer:0};window.__portfolioIntroBootstrap=state;if(!skip){state.timer=setTimeout(function(){try{if(state.recover)state.recover()}finally{r.dataset.introPhase='ready';r.style.removeProperty('overflow');var ec=document.querySelector('[data-experience-content]');if(ec)ec.removeAttribute('inert');}},maxMs+exitMs+350);}}catch(e){var d=document.documentElement;d.dataset.introPhase='ready';d.style.removeProperty('overflow');}})();`;
}
