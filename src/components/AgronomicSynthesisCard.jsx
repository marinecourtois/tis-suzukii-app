import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Dna
} from 'lucide-react';
import Latex from './Latex';

export default function AgronomicSynthesisCard() {
  return (
    <div className="rounded-xl border border-[#D6DDD4] bg-white p-6 shadow-2xs space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8ECE3] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Synthèse Scientifique & Décisionnelle</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B201C] mt-1">
            Répartition Optimale du Budget TIS : Fraise vs Cerise & Régimes Reproductifs
          </h2>
          <p className="text-xs text-[#657068] mt-1 max-w-3xl">
            Réponses fondées sur la modélisation individu-centrée (ABM) aux deux questions centrales de la recherche agronomique.
          </p>
        </div>

        <div className="shrink-0 px-3 py-2 rounded-lg bg-[#F0F2EB] border border-[#D6DDD4] text-xs font-mono">
          <div className="text-[10px] text-[#657068] uppercase">Conclusion générale</div>
          <span className="font-bold text-[#145A3D]">Divergence forte selon l'écologie hôte</span>
        </div>
      </div>

      {/* QUESTION 1 : DIFFÉRENCE FRAISE VS CERISE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#145A3D]">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#145A3D] text-white text-xs font-mono">
            1
          </span>
          <span>Y a-t-il une différence dans la répartition optimale du budget entre Fraise et Cerise ?</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Carte Cerise */}
          <div className="rounded-xl border border-[#D6DDD4] bg-[#FAFBF9] p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#BF532E]" />
                <h4 className="font-serif font-bold text-base text-[#1B201C]">Cerise (Prunus avium)</h4>
              </div>
              <span className="text-[10px] font-mono bg-[#FDF2E9] text-[#BF532E] px-2 py-0.5 rounded font-bold">
                Fenêtre courte (25 jours)
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E8ECE3] space-y-1 text-xs">
              <div className="font-semibold text-[#145A3D] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#145A3D]" />
                <span>Stratégie optimale : Inondation initiale massive (100 % J0 ou 70 % + 7j)</span>
              </div>
              <p className="text-[#657068] leading-relaxed text-[11.5px]">
                Budget efficace dès <strong>1 000 à 4 500 ♂/ha</strong> concentré sur les jours 0 à 7.
              </p>
            </div>

            <div className="text-xs text-[#657068] space-y-1.5 leading-relaxed">
              <strong className="text-[#1B201C] block text-[11.5px]">Justification biologique & agronomique :</strong>
              <p>
                • <strong>Maturité synchrone :</strong> Tous les fruits de cerise passent du vert au rouge en 20 à 25 jours. Il n'y a pas de nouvelle floraison en saison.
              </p>
              <p>
                • <strong>Urgence prophylactique :</strong> La cohorte fondatrice de <em>D. suzukii</em> doit être saturée immédiatement à J0. Fractionner le budget sur toute la saison dilue les mâles stériles et en envoie inutilement après la récolte (J25).
              </p>
            </div>
          </div>

          {/* Carte Fraise */}
          <div className="rounded-xl border border-[#D6DDD4] bg-[#FAFBF9] p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#347A55]" />
                <h4 className="font-serif font-bold text-base text-[#1B201C]">Fraise (Fragaria × ananassa)</h4>
              </div>
              <span className="text-[10px] font-mono bg-[#EDF5EB] text-[#145A3D] px-2 py-0.5 rounded font-bold">
                Récolte continue (100 jours)
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E8ECE3] space-y-1 text-xs">
              <div className="font-semibold text-[#145A3D] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#145A3D]" />
                <span>Stratégie optimale : Fractionnement continu (J+3 ou 70 % initial + maintenance 7j)</span>
              </div>
              <p className="text-[#657068] leading-relaxed text-[11.5px]">
                Budget recommandé de <strong>4 500 à 9 000 ♂/ha</strong> distribué régulièrement.
              </p>
            </div>

            <div className="text-xs text-[#657068] space-y-1.5 leading-relaxed">
              <strong className="text-[#1B201C] block text-[11.5px]">Justification biologique & agronomique :</strong>
              <p>
                • <strong>Production continue de fruits :</strong> Le fraisier fleurit et produit de nouveaux fruits réceptifs en permanence pendant 3 à 4 mois.
              </p>
              <p>
                • <strong>Durée de vie des mâles stériles (<Latex math="\mu_S = 7" /> jours) :</strong> Un lâcher unique à J0 (100% init) disparaît par sénescence vers J14. Les vagues d'émergence suivantes et les flux d'immigrants détruisent alors la récolte estivale. Le fractionnement maintient un ratio de protection continu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION 2 : IMPACT DU RÉGIME REPRODUCTIF */}
      <div className="space-y-3 pt-2 border-t border-[#E8ECE3]">
        <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#145A3D]">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#145A3D] text-white text-xs font-mono">
            2
          </span>
          <span>L'optimum dépend-il du comportement reproductif (Monoandrie vs Polyandrie) ?</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monoandrie */}
          <div className="rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-[#1B201C] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#145A3D]" />
                <span>Monoandrie (Accouplement unique)</span>
              </h4>
              <span className="text-[10px] font-mono text-[#145A3D] font-bold">1 copulation / vie</span>
            </div>
            <p className="text-xs text-[#657068] leading-relaxed">
              Dès qu'une femelle sauvage s'accouple avec un mâle stérile, elle est <strong>définitivement stérilisée</strong> pour le restant de son existence. Aucun mâle sauvage ultérieur ne peut la féconder.
            </p>
            <div className="rounded-lg bg-white p-2.5 border border-[#E8ECE3] text-[11.5px] text-[#145A3D]">
              <strong>Impact décisionnel :</strong> Les stratégies d'inondation massive initiale (100% ou 70%) sont exceptionnellement performantes car chaque mâle stérile élimine de façon irréversible une reproductrice fondatrice.
            </div>
          </div>

          {/* Polyandrie */}
          <div className="rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-[#1B201C] flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-[#BF532E]" />
                <span>Polyandrie (Accouplement multiple • <Latex math="\eta_{\text{sperm}} = 0.59" />)</span>
              </h4>
              <span className="text-[10px] font-mono text-[#BF532E] font-bold">Réaccouplement après période réfractaire</span>
            </div>
            <p className="text-xs text-[#657068] leading-relaxed">
              Une femelle initialement accouplée avec un mâle stérile peut se réaccoupler après 4 à 10 jours avec un mâle sauvage. Le sperme sauvage réintroduit restaure partiellement sa fertilité dans la spermathèque.
            </p>
            <div className="rounded-lg bg-white p-2.5 border border-[#E8ECE3] text-[11.5px] text-[#BF532E]">
              <strong>Impact décisionnel :</strong> Pénalise lourdement les lâchers uniques. <span className="font-bold">Rend obligatoires des lâchers réguliers continus (J+3 ou Quotidien)</span> afin de garantir que chaque nouvel accouplement s'effectue avec un mâle stérile.
            </div>
          </div>
        </div>
      </div>

      {/* TABLEAU RÉCAPITULATIF DES RECOMMANDATIONS */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white overflow-hidden shadow-2xs">
        <div className="bg-[#F0F2EB] px-4 py-2.5 border-b border-[#D6DDD4] flex items-center justify-between">
          <span className="font-serif font-bold text-xs text-[#1B201C]">
            Matrice Décisionnelle Récapitulative : Stratégie TIS par Contexte de Culture
          </span>
          <span className="text-[10px] font-mono text-[#657068]">Recommandations agronomiques</span>
        </div>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E8ECE3] bg-[#FAFBF9] text-left text-[11px] text-[#657068]">
              <th className="py-2.5 px-4 font-medium">Culture</th>
              <th className="py-2.5 px-3 font-medium">Régime reproductif</th>
              <th className="py-2.5 px-3 font-medium">Stratégie TIS recommandée</th>
              <th className="py-2.5 px-3 font-medium">Budget optimal</th>
              <th className="py-2.5 px-4 font-medium">Gain sanitaire attendu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8ECE3] tabular-nums">
            <tr className="hover:bg-[#F8F7F2]">
              <td className="py-2.5 px-4 font-semibold text-[#1B201C]">Cerise (25 j)</td>
              <td className="py-2.5 px-3 text-[#657068]">Monoandrie ou Polyandrie</td>
              <td className="py-2.5 px-3 font-bold text-[#BF532E]">100 % initial à J0 ou 70 % + 7j</td>
              <td className="py-2.5 px-3 font-mono">1 000 – 4 500 ♂/ha</td>
              <td className="py-2.5 px-4 text-[#145A3D] font-medium">+24 % fruits sains (82 % vs 58 % témoin)</td>
            </tr>
            <tr className="hover:bg-[#F8F7F2]">
              <td className="py-2.5 px-4 font-semibold text-[#1B201C]">Fraise (100 j)</td>
              <td className="py-2.5 px-3 text-[#657068]">Monoandrie</td>
              <td className="py-2.5 px-3 font-bold text-[#145A3D]">70 % init + maintenance 7j</td>
              <td className="py-2.5 px-3 font-mono">4 500 ♂/ha</td>
              <td className="py-2.5 px-4 text-[#145A3D] font-medium">+36 % fruits sains (87 % vs 51 % témoin)</td>
            </tr>
            <tr className="hover:bg-[#F8F7F2] bg-[#F5F8F4]">
              <td className="py-2.5 px-4 font-semibold text-[#145A3D]">Fraise (100 j)</td>
              <td className="py-2.5 px-3 text-[#BF532E] font-medium">Polyandrie (terrain réel)</td>
              <td className="py-2.5 px-3 font-bold text-[#145A3D]">Lâchers tous les 3 jours (J+3)</td>
              <td className="py-2.5 px-3 font-mono">4 500 – 9 000 ♂/ha</td>
              <td className="py-2.5 px-4 text-[#145A3D] font-medium">+37 % fruits sains (88 % vs 51 % témoin)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
