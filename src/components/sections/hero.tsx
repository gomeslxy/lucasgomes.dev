import { ProfileCard } from "@/components/hero/profile-card";
import { ProfileStage } from "@/components/hero/profile-stage";
import { LocalTime } from "@/components/ui/local-time";
import styles from "@/components/hero/hero.module.css";

/** Server content is visible before the motion layer hydrates. */
export function Hero() {
  return (
    <ProfileStage>
      <div className={styles.stageMeta}>
        <span><span className={styles.tinyCross}>+</span> UM POUCO DE MIM, EM CÓDIGO.</span>
        <span className={styles.localTime}>BR / SP <span className={styles.metaDivider}>—</span> <LocalTime /></span>
      </div>
      <ProfileCard />
    </ProfileStage>
  );
}
