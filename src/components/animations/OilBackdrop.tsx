/**
 * Fond anime "goutte d'huile".
 * - Une goutte doree tombe au centre.
 * - L'impact deploye une nappe d'huile, des ondes et un voile irise.
 * Animation 100% CSS. Respecte prefers-reduced-motion.
 * A placer en `absolute inset-0` derriere le contenu du Hero.
 * Styles associes : `.oil-hero` dans globals.css.
 */
export function OilBackdrop() {
  return (
    <div className="oil-hero" aria-hidden="true">
      <div className="nappe" />
      <div className="irise" />

      <div className="ondes">
        <div className="onde o1" />
        <div className="onde o2" />
        <div className="onde o3" />
        <div className="onde o4" />
        <div className="onde loop l1" />
        <div className="onde loop l2" />
      </div>

      <div className="goutte-scene">
        <div className="goutte" />
      </div>
    </div>
  );
}
