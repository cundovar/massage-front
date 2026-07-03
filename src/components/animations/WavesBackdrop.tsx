/**
 * Fond animé "vagues & ondes" (bord de mer apaisant).
 * - Trois couches de vagues qui défilent en boucle (houle) avec léger tangage vertical.
 * - Ondes concentriques (gouttes) qui pulsent.
 * Animation 100% CSS (aucun hook). Respecte prefers-reduced-motion.
 * À placer en `absolute inset-0` derrière le contenu du Hero.
 * Styles associés : `.waves-hero` dans globals.css.
 */
export function WavesBackdrop() {
  return (
    <div className="waves-hero" aria-hidden="true">
      {/* Ondes concentriques */}
      <div className="gouttes">
        <div className="goutte g1" />
        <div className="goutte g2" />
        <div className="goutte g3" />
      </div>

      {/* Vagues */}
      <div className="vagues">
        <div className="vague-osc o1">
          <div className="vague l1" />
        </div>
        <div className="vague-osc o2">
          <div className="vague l2" />
        </div>
        <div className="vague-osc o3">
          <div className="vague l3" />
        </div>
      </div>
    </div>
  );
}
