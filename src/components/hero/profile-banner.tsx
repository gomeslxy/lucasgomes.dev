import Image from "next/image";
import { heroProfile } from "@/lib/hero-profile";
import styles from "./hero.module.css";

/** The supplied banner remains intact; perspective belongs to the profile card. */
export function ProfileBanner() {
  return (
    <div className={styles.banner} data-profile-layer="banner">
      <Image src={heroProfile.bannerSrc} alt={heroProfile.bannerAlt} fill priority sizes="(max-width: 700px) 94vw, (max-width: 1008px) 95vw, 960px" className={styles.bannerImage} quality={90} />
    </div>
  );
}
