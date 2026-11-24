import { experienceConfig } from "@/lib/experience-config";

export const INTRO_SESSION_KEY = "lucas:portfolio-intro:v3";

/**
 * Generates the synchronous <head> bootstrap script so `data-intro-phase`
 * is resolved before first paint, preventing hydration flash or FOUC.
 */
export function getIntroBootstrapScript(): string {
  const timings = JSON.stringify(experienceConfig.intro);
  return `(function(){try{var r=document.documentElement,c=${timings},m=matchMedia('(max-width: 767px), (pointer: coarse)').matches,n=performance.getEntriesByType('navigation')[0],seen=false;try{seen=sessionStorage.getItem('${INTRO_SESSION_KEY}')==='seen'}catch(e){}var isReload=n&&n.type==='reload';var skip=matchMedia('(prefers-reduced-motion: reduce)').matches||!!location.hash||document.hidden||(seen&&!isReload)||(n&&n.type==='back_forward');r.dataset.introPhase=skip?'ready':'loading';r.style.setProperty('--intro-exit-ms',(m?c.mobileExitMs:c.exitMs)+'ms');r.style.setProperty('--intro-max-ms',(m?c.mobileMaximumMs:c.maximumMs)+'ms');var state={startedAt:performance.now(),skip:!!skip,timer:0};window.__portfolioIntroBootstrap=state;if(!skip){state.timer=setTimeout(function(){try{if(state.recover)state.recover()}finally{r.dataset.introPhase='ready'}},(m?c.mobileMaximumMs:c.maximumMs)+(m?c.mobileExitMs:c.exitMs)+300);}}catch(e){document.documentElement.dataset.introPhase='ready';}})();`;
}
