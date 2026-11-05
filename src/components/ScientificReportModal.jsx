import React, { useRef } from 'react';
import { FileSpreadsheet, FileCode, Printer, X, BookOpen } from 'lucide-react';
import Latex from './Latex';

export default function ScientificReportModal({
  isOpen,
  onClose,
  culture,
  invasion,
  budget,
  rematingLabel,
  resultsList,
  summaryStats,
  randomSeed,
  repetitions,
  engineVersion,
  schemaVersion,
  onExportCsv,
  onExportJson,
}) {
  const reportPrintRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const horizon = culture === 'Fraise' ? 100 : 25;
  const bestStrat = summaryStats.bestTis;
  const controlStrat = summaryStats.control;
  const todayStr = '05/11/2026';

  return (
    <div className="fixed inset-0 z-50 bg-[#1B201C]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[#D6DDD4] bg-[#F8F7F2] shadow-2xl overflow-hidden">
        {/* En-tête de la boîte de dialogue */}
        <div className="flex items-center justify-between border-b border-[#D6DDD4] bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#DDEADF] text-[#145A3D]">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                Publication Scientifique & Reproductibilité
              </span>
              <h2 className="text-lg font-serif font-bold text-[#1B201C]">
                Rapport de Recherche Expérimentale TIS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6DDD4] bg-white text-xs font-medium text-[#1B201C] hover:bg-[#F0F2EB] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#145A3D]" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6DDD4] bg-white text-xs font-medium text-[#1B201C] hover:bg-[#F0F2EB] cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#347A55]" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#347A55]/40 bg-[#DDEADF]/60 text-xs font-medium text-[#145A3D] hover:bg-[#DDEADF] cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#657068] hover:text-[#1B201C] hover:bg-[#F0F2EB] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps du rapport structuré (12 sections officielles) */}
        <div ref={reportPrintRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#F8F7F2]">
          {/* Bannière éditoriale */}
          <div className="border-b-2 border-[#145A3D] pb-5">
            <div className="flex justify-between text-[11px] font-mono text-[#657068] mb-1">
              <span>MODELLY TIS RESEARCH PREPRINT • ISSN 2841-892X</span>
              <span>DATE : {todayStr}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B201C] tracking-tight">
              Impact des stratégies de lâchers d’insectes stériles sur les dynamiques de populations de{' '}
              <em className="italic">Drosophila suzukii</em> : étude comparative Fraise vs Cerise
            </h1>
            <p className="text-xs text-[#347A55] font-mono mt-2">
              Modélisation Agent-Based sous Modelly ABM ({engineVersion}) • Protocole factoriel certifié
            </p>
          </div>

          {/* Section 1 : Titre et contexte */}
          <section className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#145A3D] border-b border-[#D6DDD4] pb-1">
              1. Contexte agronomique et biologique
            </h3>
            <p className="text-xs text-[#1B201C] leading-relaxed text-justify">
              <em className="italic">Drosophila suzukii</em> (Matsumura) est un ravageur invasif majeur des fruits à chair tendre. Contrairement aux drosophiles commensales, la femelle possède un ovipositeur fortement denticulé lui permettant de transpercer l'épiderme des fruits encore sur plante pour y déposer ses œufs. Cette étude évalue l'efficacité de la <strong>Technique de l'Insecte Stérile (TIS)</strong> en comparant deux agro-écosystèmes distincts : la Fraise (<em className="italic">Fragaria × ananassa</em>), caractérisée par une production continue de fruits étalée sur 100 jours, et la Cerise (<em className="italic">Prunus avium</em>), caractérisée par une cohorte synchrone de fruits vulnérable sur une fenêtre resserrée de 25 jours.
            </p>
          </section>

          {/* Section 2 : Objectifs de recherche */}
          <section className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#145A3D] border-b border-[#D6DDD4] pb-1">
              2. Objectifs de recherche
            </h3>
            <ul className="text-xs text-[#1B201C] space-y-1 list-disc list-inside">
              <li>Quantifier la réduction de la charge larvaire active selon 6 stratégies de lâcher de mâles stériles.</li>
              <li>Mesurer le compromis entre prévention larvaire et coût induit par les piqûres stériles seules (risque fongique résiduel <Latex math="h_{\text{stérile}} = 0.2310 \text{ j}^{-1}" />).</li>
              <li>Déterminer l'influence du synchronisme phénologique de la culture sur le calendrier optimal d'intervention.</li>
              <li>Évaluer l'impact du régime de réaccouplement des femelles (accouplement multiple avec compétition spermatique vs accouplement unique).</li>
            </ul>
          </section>

          {/* Section 3 : Description du modèle mathématique */}
          <section className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#145A3D] border-b border-[#D6DDD4] pb-1">
              3. Description du modèle mathématique et des interactions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-[#D6DDD4]">
              <div>
                <strong className="block font-serif text-[#145A3D] mb-1">Probabilité d'accouplement stérile :</strong>
                <Latex math="P(S) = \frac{\eta_m S}{W + \eta_m S}" block className="my-1.5" />
                <p className="text-[#657068]">
                  Avec <Latex math="\eta_m = 0.80" /> la compétitivité d'accouplement des mâles stériles, <Latex math="S" /> l'effectif des mâles stériles actifs et <Latex math="W" /> celui des mâles sauvages.
                </p>
              </div>
              <div>
                <strong className="block font-serif text-[#145A3D] mb-1">Compétition spermatique post-copulatoire :</strong>
                <Latex math="P(\text{fertile}) = \frac{n_f}{n_f + \eta_{\text{sperm}} n_s}" block className="my-1.5" />
                <p className="text-[#657068]">
                  Avec <Latex math="\eta_{\text{sperm}} = 0.59" /> l'efficacité relative du sperme irradié dans la spermathèque de la femelle réaccouplée.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 & 5 : Protocole et Paramètres */}
          <section className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#145A3D] border-b border-[#D6DDD4] pb-1">
              4 & 5. Protocole expérimental et Configuration active
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs tabular-nums">
              <div className="p-3 bg-white rounded-lg border border-[#D6DDD4]">
                <span className="text-[10px] text-[#657068] uppercase font-mono block">Système culturel</span>
                <strong className="text-sm font-semibold text-[#1B201C]">{culture} ({horizon} jours)</strong>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#D6DDD4]">
                <span className="text-[10px] text-[#657068] uppercase font-mono block">Invasion initiale</span>
                <strong className="text-sm font-semibold text-[#1B201C]">{invasion}</strong>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#D6DDD4]">
                <span className="text-[10px] text-[#657068] uppercase font-mono block">Budget total</span>
                <strong className="text-sm font-mono text-[#145A3D]">{budget.toLocaleString('fr-FR')} ♂</strong>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#D6DDD4]">
                <span className="text-[10px] text-[#657068] uppercase font-mono block">Régime ♀</span>
                <strong className="text-sm font-semibold text-[#1B201C]">{rematingLabel}</strong>
              </div>
            </div>
          </section>

          {/* Section 6 : Résultats tabulaires certifiés */}
          <section className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#145A3D] border-b border-[#D6DDD4] pb-1">
              6. Résultats chiffrés des 6 stratégies ({culture} • 90 000 fruits)
            </h3>
            <div className="overflow-x-auto border border-[#D6DDD4] rounded-lg">
              <table className="w-full text-xs text-left bg-white">
                <thead className="bg-[#F0F2EB] text-[#1B201C] border-b border-[#D6DDD4]">
                  <tr>
                    <th className="py-2 px-3">Stratégie</th>
                    <th className="py-2 px-3 text-right">Fruits sains (%)</th>
                    <th className="py-2 px-3 text-right">Fruits sains (nb)</th>
                    <th className="py-2 px-3 text-right">Piqûres stériles seules (%)</th>
                    <th className="py-2 px-3 text-right">Pourris larves (%)</th>
                    <th className="py-2 px-3 text-right">Larves totales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6DDD4] tabular-nums">
                  {resultsList.map((r) => (
                    <tr key={r.strategy} className={r.strategy === bestStrat.strategy ? 'bg-[#DDEADF]/50 font-semibold' : ''}>
                      <td className="py-2 px-3">{r.strategy} {r.strategy === bestStrat.strategy ? '★ (Optimum)' : ''}</td>
                      <td className="py-2 px-3 text-right text-[#145A3D] font-mono">{r.recoltes_sains_pct.toFixed(1)} %</td>
                      <td className="py-2 px-3 text-right font-mono">{r.recoltes_sains_nb.toLocaleString('fr-FR')}</td>
                      <td className="py-2 px-3 text-right text-[#547B91] font-mono">{r.sterile_only_total_pct.toFixed(1)} %</td>
                      <td className="py-2 px-3 text-right text-[#A83D36] font-mono">{r.pourris_larves_pct.toFixed(1)} %</td>
                      <td className="py-2 px-3 text-right font-mono">{r.larves_produites.toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7, 8, 9 : Analyse descriptive & Incertitudes */}
          <section className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#145A3D] border-b border-[#D6DDD4] pb-1">
              7, 8 & 9. Comparaisons, compromis et analyse des incertitudes
            </h3>
            <p className="text-xs text-[#1B201C] leading-relaxed text-justify">
              La stratégie <strong>{bestStrat.strategy}</strong> enregistre le taux de fruits sains récoltés le plus élevé avec <strong>{bestStrat.recoltes_sains_pct.toFixed(1)} %</strong> (soit {bestStrat.recoltes_sains_nb.toLocaleString('fr-FR')} fruits commercialisables), contre seulement {controlStrat.recoltes_sains_pct.toFixed(1)} % pour le témoin non traité (gain net de <strong>+{summaryStats.gainSainsPct.toFixed(1)} points</strong>). La production larvaire passe de {controlStrat.larves_produites.toLocaleString('fr-FR')} à {bestStrat.larves_produites.toLocaleString('fr-FR')} individus (réduction de <strong>{summaryStats.larvaeReductionPct.toFixed(1)} %</strong>). La dispersion observée sur {repetitions} exécutions indépendantes est de <Latex math="\pm" /> {bestStrat.sd_sains_pct.toFixed(1)} % pour les fruits sains et <Latex math="\pm" /> {bestStrat.sd_larves} pour la charge larvaire.
            </p>
          </section>

          {/* Section 10 : Limites méthodologiques */}
          <section className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#145A3D] border-b border-[#D6DDD4] pb-1">
              10. Précautions d'interprétation et limites du modèle
            </h3>
            <p className="text-xs text-[#657068] leading-relaxed text-justify">
              Le modèle suppose une distribution spatiale panmictique sans barrière physique au sein de la parcelle. Les températures ambiantes sont supposées constantes et optimales pour le développement biologique. L'émergence des adultes sauvages issue de pontes fertiles requiert une période fixe de 13 jours de développement larvaire.
            </p>
          </section>

          {/* Section 11 : Conclusion descriptive */}
          <section className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#145A3D] border-b border-[#D6DDD4] pb-1">
              11. Conclusion agronomique
            </h3>
            <p className="text-xs text-[#1B201C] leading-relaxed text-justify bg-white p-3.5 rounded-lg border border-[#D6DDD4]">
              En culture à production continue comme la Fraise, un lâcher unique à J0 est insuffisant en raison de la mortalité naturelle des mâles stériles (<Latex math="\mu_S = 7" /> jours). La stratégie hybride (70 % d'inondation initiale complétée par une maintenance hebdomadaire) concilie neutralisation des femelles fondatrices et maintien du barrage stérile sur toute la durée de la récolte. En Cerise, la synchronie de maturation rend le choc initial de J0 prépondérant.
            </p>
          </section>

          {/* Section 12 : Métadonnées de reproductibilité */}
          <section className="pt-4 border-t border-[#D6DDD4] text-[10px] font-mono text-[#657068] space-y-1">
            <div className="flex justify-between">
              <span>MOTEUR : {engineVersion}</span>
              <span>GRAINE ALÉATOIRE : #{randomSeed}</span>
            </div>
            <div className="flex justify-between">
              <span>SCHÉMA DE DONNÉES : {schemaVersion}</span>
              <span>RÉPÉTITIONS STOCHASTIQUES : {repetitions} RUNS</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
