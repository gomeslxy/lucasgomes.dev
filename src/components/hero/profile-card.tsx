import { ArrowUpRight, Braces, Code2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { heroProfile } from "@/lib/hero-profile";
import { profile } from "@/lib/data";
import { ProfileBanner } from "./profile-banner";
import { ProfileActions } from "./profile-actions";
import { RichPresence } from "./rich-presence";
import styles from "./hero.module.css";

export function ProfileCard() {
  return (
    <article className={styles.card} data-profile-surface aria-label={`Perfil de ${heroProfile.displayName}`}>
      <ProfileBanner />
      <div className={styles.cardBody} data-profile-group>
        <div className={styles.identity} data-profile-layer="identity">
          <div className={styles.avatarRow} data-profile-layer="avatar">
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                {heroProfile.avatarSrc ? (
                  <Image src={heroProfile.avatarSrc} alt={`Foto de ${heroProfile.displayName}`} fill sizes="104px" priority className={styles.avatarImage} />
                ) : (
                  <span className={styles.monogram} aria-label="Espaço para foto de perfil">{heroProfile.initials}<span>✳</span></span>
                )}
              </div>
              <span className={styles.onlineDot} title={heroProfile.status}><span className="sr-only">{heroProfile.status}</span></span>
            </div>
            <div className={styles.badges} aria-label="Badges de desenvolvedor">
              <span className={styles.badge} title="Desenvolvedor full-stack"><Code2 size={16} aria-hidden="true" /><span className="sr-only">Full-stack</span></span>
              <span className={styles.badge} title="TypeScript"><span aria-hidden="true" className={styles.tsBadge}>TS</span><span className="sr-only">TypeScript</span></span>
              <span className={`${styles.badge} ${styles.specialBadge}`} title="Inteligência artificial aplicada"><Sparkles size={15} aria-hidden="true" /><span className="sr-only">IA aplicada</span></span>
            </div>
          </div>
          <div className={styles.nameRow}>
            <h1 id="hero-title" aria-label={heroProfile.displayName}>
              {Array.from(heroProfile.displayName).map((letter, index) => <span key={`${letter}-${index}`} aria-hidden="true" className={styles.nameLetter} style={{ "--letter": index } as CSSProperties}>{letter}</span>)}
              <span aria-hidden="true" className={styles.namePeriod}>.</span>
            </h1>
            <ShieldCheck size={21} className={styles.nameBadge} aria-label="Perfil do desenvolvedor" />
          </div>
          <p className={styles.handle}>{heroProfile.handle}</p>
          <p className={styles.role}><Braces size={14} aria-hidden="true" /> {heroProfile.role}</p>
          <p className={styles.location}><MapPin size={12} aria-hidden="true" /> {profile.city}<span>·</span> Brasil</p>
          <div className={styles.socials}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon size={15} /><span>GitHub</span><ArrowUpRight size={12} aria-hidden="true" /></a>
            <span className={styles.socialDivider} />
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon size={14} /><span>LinkedIn</span><ArrowUpRight size={12} aria-hidden="true" /></a>
          </div>
        </div>
        <div className={styles.profileDetails} data-profile-layer="details">
          <div className={styles.about}>
            <h2 className={styles.eyebrow}>POR TRÁS DO CÓDIGO</h2>
            <p>{heroProfile.bio}</p>
          </div>
          <ul className={styles.stack} aria-label="Tecnologias principais">
            {heroProfile.stack.map((technology) => <li key={technology}>{technology === "React" && <span className={styles.reactMark} aria-hidden="true">⚛</span>}{technology}</li>)}
          </ul>
          <RichPresence />
        </div>
      </div>
      <ProfileActions />
    </article>
  );
}
