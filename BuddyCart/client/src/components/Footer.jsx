import styles from "../components/Footer.module.css";
import SmallLogo from "../assets/logo-small.png";

function Footer() {
  return (
    <div className={styles.footer}>
      <button className={styles.footerBtn}>
        <img className={styles.footerImg} src={SmallLogo} alt="" />
      </button>
    </div>
  );
}

export default Footer;
