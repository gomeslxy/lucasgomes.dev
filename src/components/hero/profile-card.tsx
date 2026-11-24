import { ArrowUpRight, Braces, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { AnchorLink } from "@/components/ui/anchor-link";
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
            <span className={styles.statusPill}>
              <span className={styles.statusDot} aria-hidden="true" />
              {heroProfile.status}
            </span>
          </div>
          <div className={styles.nameRow}>
            <h1 id="hero-title" aria-label={heroProfile.displayName}>
              {Array.from(heroProfile.displayName).map((letter, index) => <span key={`${letter}-${index}`} aria-hidden="true" className={styles.nameLetter} style={{ "--letter": index } as CSSProperties}>{letter}</span>)}
              <span aria-hidden="true" className={styles.namePeriod}>.</span>
            </h1>
          </div>
          <p className={styles.handle}>{heroProfile.handle}</p>
          <p className={styles.role}><Braces size={14} aria-hidden="true" /> {heroProfile.role}</p>
          <p className={styles.location}><MapPin size={12} aria-hidden="true" /> {profile.city}<span>·</span> {profile.country}</p>
          <div className={styles.socials}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon size={15} /><span>GitHub</span><ArrowUpRight size={12} aria-hidden="true" /></a>
            <span className={styles.socialDivider} />
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon size={14} /><span>LinkedIn</span><ArrowUpRight size={12} aria-hidden="true" /></a>
            <span className={styles.socialDivider} />
            <AnchorLink href="#contato"><Mail size={14} aria-hidden="true" /><span>Contato</span><ArrowUpRight size={12} aria-hidden="true" /></AnchorLink>
          </div>
        </div>
        <div className={styles.profileDetails} data-profile-layer="details">
          <div className={styles.about}>
            <span className={styles.eyebrow}>RESUMO</span>
            <h2 className={styles.pitchTitle}>{heroProfile.headline}</h2>
            <p>{heroProfile.bio}</p>
          </div>
          <RichPresence />
        </div>
      </div>
      <ProfileActions />
    </article>
  );
}
