import Image from "next/image";
import { heroProfile } from "@/lib/hero-profile";
import styles from "./hero.module.css";

/** Perspective belongs to the profile card; the banner stays crisp inside its frame. */
export function ProfileBanner() {
  return (
    <div className={styles.banner} data-profile-layer="banner">
      <Image src={heroProfile.bannerSrc} alt={heroProfile.bannerAlt} fill priority sizes="(max-width: 860px) 94vw, 960px" className={styles.bannerImage} quality={90} />
    </div>
  );
}
