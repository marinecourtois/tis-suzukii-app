import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Compass
} from 'lucide-react';
import Latex from './Latex';

export default function ModelArchitectureView({ onNavigateToStudio = () => {}, onNavigateToDynamics = () => {} }) {
  const [activeStep, setActiveStep] = useState(1);
  const [activeAgentTab, setActiveAgentTab] = useState('sterile_male');

  const TUTORIAL_STEPS = [
    {
      step: 1,
      title: 'Inoculum initial & Capacité de charge (K)',
      subtitle: 'Comment la dynamique démarre dans la parcelle',
      content: (
        <div className="space-y-3 text-xs text-[#1B201C]">
          <p className="leading-relaxed">
            Au commencement de la saison (J0), la parcelle héberge un <strong>inoculum de départ</strong>{' '}
            composé de mouches sauvages fondatrices ayant survécu à l'hiver. L'application propose 3 scénarios :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-[#D6DDD4] bg-white">
              <span className="font-bold text-[#145A3D] block text-xs">Inoculum Faible</span>
              <span className="text-[11px] text-[#657068]">180 adultes (90 ♂, 90 ♀)</span>
              <p className="text-[10px] text-[#657068] mt-1">Parcelle isolée ou sortie d'hiver rigoureux (6 % de K).</p>
            </div>
            <div className="p-3 rounded-lg border border-[#D6DDD4] bg-white">
              <span className="font-bold text-[#145A3D] block text-xs">Inoculum Modéré</span>
              <span className="text-[11px] text-[#657068]">600 adultes (300 ♂, 300 ♀)</span>
              <p className="text-[10px] text-[#657068] mt-1">Pression printanière standard en lisière (20 % de K).</p>
            </div>
            <div className="p-3 rounded-lg border border-[#BF532E] bg-[#FAF1EC]">
              <span className="font-bold text-[#BF532E] block text-xs">Inoculum Fort (= Capacité K)</span>
              <span className="text-[11px] text-[#BF532E] font-mono">3 000 adultes (1 500 ♂, 1 500 ♀)</span>
              <p className="text-[10px] text-[#657068] mt-1">
                Saturation maximale égale au pic sans TIS (capacité de charge K = 3 000 ind.).
              </p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#EDF5EB] border border-[#A3C9A6] flex items-start gap-2 text-[11px] text-[#145A3D]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Concept clé de capacité de charge (K) :</strong> Sans lâchers TIS, la population
              ne croît pas à l'infini mais plafonne asymptotiquement à K en raison de la limitation de l'espace,
              du microclimat et des ressources trophiques.
            </span>
          </div>
        </div>
      )
    },
    {
      step: 2,
      title: 'Immigration continue de terrain',
      subtitle: 'Pourquoi la fin de saison des fraises décroche sans protection',
      content: (
        <div className="space-y-3 text-xs text-[#1B201C]">
          <p className="leading-relaxed">
            Contrairement aux modèles de laboratoire en milieu clos, notre modèle intègre un{' '}
            <strong>flux d'immigration journalier</strong> de femelles et mâles fertiles provenant des réservoirs
            boisés et des haies de ronces sauvages entourant les cultures :
          </p>
          <div className="p-3 rounded-lg border border-[#D6DDD4] bg-white font-mono text-[11px] space-y-1">
            <div className="text-[#145A3D]">m_♀(t) = 15 femelles sauvages / jour (Fraise) | 8 femelles / jour (Cerise)</div>
            <div className="text-[#657068]">m_♂(t) = 15 mâles sauvages / jour (Fraise) | 8 mâles / jour (Cerise)</div>
          </div>
          <div className="p-3 rounded-lg bg-[#FAF1EC] border border-[#BF532E]/30 text-[11px] text-[#1B201C] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#BF532E]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Effet agronomique remarquable sur la Fraise (100 jours) :</span>
            </div>
            <p className="text-[#657068]">
              Même si l'on part d'un <em>inoculum faible</em>, les 40 premiers jours offrent une récolte
              remarquablement saine (&lt; 5 % de pertes). Cependant, les immigrants journaliers s'accumulent
              et se reproduisent : <strong>sur les 30 derniers jours (J70 à J100), la récolte s'effondre</strong>{' '}
              avec plus de 80 % de fruits gâtés sans TIS ! C'est la signature agronomique typique de la fraise remontante.
            </p>
          </div>
        </div>
      )
    },
    {
      step: 3,
      title: 'Compétition sexuelle & Polyandrie',
      subtitle: 'Comment les mâles stériles neutralisent la ponte',
      content: (
        <div className="space-y-3 text-xs text-[#1B201C]">
          <p className="leading-relaxed">
            Chaque jour, les femelles réceptives rencontrent des mâles selon une loterie stochastique proportionnelle
            à l'abondance relative et pondérée par la compétitivité d'accouplement <Latex math="\eta_m = 0.80" /> :
          </p>
          <div className="p-3 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] text-center">
            <Latex math="P(S) = \frac{\eta_m \cdot S}{W + \eta_m \cdot S} = \frac{0.80 \cdot S}{W + 0.80 \cdot S}" block />
          </div>
          <p className="leading-relaxed">
            Si la femelle s'accouple plusieurs fois (régime de polyandrie), la fertilité de ses œufs dépend
            de la compétition spermatique dans sa spermathèque avec un coefficient stérile{' '}
            <Latex math="\eta_{\text{sperm}} = 0.59" /> :
          </p>
          <div className="p-3 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] text-center">
            <Latex math="P(\text{fertile}) = \frac{n_f}{n_f + \eta_{\text{sperm}} \cdot n_s} = \frac{n_f}{n_f + 0.59 \cdot n_s}" block />
          </div>
        </div>
      )
    },
    {
      step: 4,
      title: 'Phénologie des fruits & Seuil de dommage',
      subtitle: 'Quand les fruits sont-ils attaqués et pourquoi ?',
      content: (
        <div className="space-y-3 text-xs text-[#1B201C]">
          <p className="leading-relaxed">
            Les femelles ne peuvent pas pondre dans n'importe quel fruit :
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#657068]">
            <li><strong className="text-[#145A3D]">Fruits verts (J0–J12) :</strong> Cuticule dure, acide, impénétrable. Risque de ponte = 0 %.</li>
            <li><strong className="text-[#D97706]">Fruits tournants (J12–J17) :</strong> Ramollissement cuticulaire, virage anthocyanique. Début des attaques (~30 %).</li>
            <li><strong className="text-[#DC2626]">Fruits mûrs (J17–J22) :</strong> Attractivité olfactive et sucres maximaux. Vulnérabilité totale (100 %) et récolte.</li>
          </ul>
          <p className="leading-relaxed">
            Un fruit piqué par une femelle ayant du sperme stérile ne développe aucun asticot : il est
            récolté sain ou classé en "piqûre stérile" commercialisable sans dépréciation.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* BANDEAU SUPÉRIEUR ÉDITORIAL */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Architecture & Fondements Scientifiques</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B201C] mt-1">
              Architecture du modèle individu-centré (ABM) Modelly
            </h2>
            <p className="text-xs text-[#657068] mt-1 max-w-3xl leading-relaxed">
              Consultez l'ensemble des hypothèses biomathématiques, les classes d'agents autonomes,
              la cinétique de vulnérabilité phénologique des fruits et le guide méthodologique étape par étape.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onNavigateToStudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6DDD4] bg-white text-xs font-medium text-[#1B201C] hover:bg-[#F0F2EB] cursor-pointer shadow-2xs"
            >
              <Cpu className="w-3.5 h-3.5 text-[#145A3D]" />
              <span>Lancer Simulation Studio</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToDynamics}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#145A3D] text-white text-xs font-medium hover:bg-[#1E5E41] cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Voir Dynamiques Agents</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
          SECTION 1 : GUIDE ÉTAPE PAR ÉTAPE DE COMPRÉHENSION DU MODÈLE
         =================================================================== */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8ECE3] pb-2.5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#145A3D]" />
            <h3 className="text-base font-serif font-bold text-[#1B201C]">
              Guide méthodologique étape par étape : Comprendre et interpréter les résultats
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#657068]">
            Étape {activeStep} sur {TUTORIAL_STEPS.length}
          </span>
        </div>

        {/* Boutons d'étapes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TUTORIAL_STEPS.map((s) => {
            const isCurrent = activeStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#145A3D] bg-[#EDF5EB] shadow-2xs'
                    : 'border-[#D6DDD4] bg-[#F8F7F2] hover:bg-[#F0F2EB]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={isCurrent ? 'text-[#145A3D] font-bold' : 'text-[#657068]'}>
                    ÉTAPE {s.step}
                  </span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#145A3D]" />}
                </div>
                <div className="text-xs font-serif font-bold text-[#1B201C] truncate">{s.title}</div>
                <div className="text-[10px] text-[#657068] truncate mt-0.5">{s.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Contenu de l'étape active */}
        <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2]">
          {TUTORIAL_STEPS.find((s) => s.step === activeStep)?.content}
        </div>

        {/* Navigation entre étapes */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
            className="px-3 py-1.5 rounded-lg border border-[#D6DDD4] text-xs font-medium text-[#1B201C] disabled:opacity-30 cursor-pointer"
          >
            ← Étape précédente
          </button>
          <button
            type="button"
            disabled={activeStep === TUTORIAL_STEPS.length}
            onClick={() => setActiveStep((s) => Math.min(TUTORIAL_STEPS.length, s + 1))}
            className="px-3 py-1.5 rounded-lg bg-[#145A3D] text-white text-xs font-medium disabled:opacity-30 cursor-pointer"
          >
            Étape suivante →
          </button>
        </div>
      </div>

      {/* ===================================================================
          SECTION 2 : ARCHITECTURE ORIENTÉE AGENTS & LES 4 CLASSES D'AGENTS
         =================================================================== */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
        <div className="border-b border-[#E8ECE3] pb-2.5">
          <h3 className="text-base font-serif font-bold text-[#1B201C]">
            Architecture orientée objet : Les 4 classes d'agents
          </h3>
          <p className="text-xs text-[#657068]">
            Chaque individu possède des attributs physiologiques internes, un cycle de vie stochastique et des règles de transition d'état
          </p>
        </div>

        {/* Sélecteur d'agent */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          {[
            { id: 'sterile_male', label: 'SterileMaleAgent (Mâle stérile)', color: 'text-[#145A3D]' },
            { id: 'wild_male', label: 'WildMaleAgent (Mâle sauvage)', color: 'text-[#657068]' },
            { id: 'wild_female', label: 'WildFemaleAgent (Femelle sauvage)', color: 'text-[#BF532E]' },
            { id: 'fruit_agent', label: 'FruitAgent (Fruit hôte)', color: 'text-[#D97706]' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveAgentTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeAgentTab === tab.id
                  ? 'bg-[#145A3D] text-white shadow-2xs'
                  : 'bg-[#F8F7F2] text-[#1B201C] hover:bg-[#F0F2EB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Détails de la classe d'agent sélectionnée */}
        {activeAgentTab === 'sterile_male' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#145A3D] font-bold uppercase">Biométrie & Survie</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Longévité post-irradiation</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Durée de vie <Latex math="L_S \sim \mathcal{N}(\mu_S = 7.0\text{j}, \sigma_S = 2.1\text{j})" /> tronquée à ≥ 1 jour.
                L'irradiation gamma/rayons X induit un coût physiologique (stress oxydatif) réduisant l'espérance
                par rapport aux sauvages.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#145A3D] font-bold uppercase">Compétitivité Sexuelle</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Courtship & Phéromones</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Pondération d'attractivité <Latex math="\eta_m = 0.80" />. Un mâle stérile a 80 % de chances
                autant qu'un mâle sauvage d'obtenir les faveurs d'une femelle réceptive lors d'une parade nuptiale.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#145A3D] font-bold uppercase">Sperme Dominant</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Léthalité embryonnaire</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Le transfert de spermatozoïdes porteurs de mutations chromosomiques dominantes provoque
                la mort précoce des blastodermes lors du clivage cellulaire : 0 % d'éclosion larvaire.
              </p>
            </div>
          </div>
        )}

        {activeAgentTab === 'wild_male' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#657068] font-bold uppercase">Démographie</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Longévité naturelle</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Espérance de vie <Latex math="\mu_W = 25.0\text{j}" /> (loi normale avec <Latex math="\sigma = 7.5\text{j}" />).
                Actif dès le 1er jour après émergence.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#657068] font-bold uppercase">Pression de concurrence</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Accouplements fertiles</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Chaque accouplement réussi avec une femelle sauvage engendre une descendance complète
                qui viendra saturer le milieu à <Latex math="T_{\text{dev}} = 14\text{j}" />.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#657068] font-bold uppercase">Immigration</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Apport extérieur continu</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Renouvelé quotidiennement par le flux de terrain (<Latex math="m_♂ \approx 15\text{/j}" />),
                empêchant l'épuisement total du sperme sauvage sans TIS récurrente.
              </p>
            </div>
          </div>
        )}

        {activeAgentTab === 'wild_female' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#BF532E] font-bold uppercase">Oviscapte denté</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Capacité de perforation</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Morphologie unique à <em>Drosophila suzukii</em> : sclérifié et crénelé, capable d'inciser
                l'épiderme des fruits fermes dès le stade tournant.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#BF532E] font-bold uppercase">Polyandrie & Spermathèque</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Période réfractaire</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Après un accouplement, la femelle entre en phase réfractaire (4 à 10 jours après un mâle stérile,
                3 à 12 jours après un mâle sauvage) avant d'accepter un nouveau prétendant.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#BF532E] font-bold uppercase">Fécondité journalière</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">15 à 25 œufs / jour</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Pondus sous la cuticule des fruits mûrs ou tournants. La larve éclot en 24–48h et creuse
                immédiatement la pulpe.
              </p>
            </div>
          </div>
        )}

        {activeAgentTab === 'fruit_agent' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#D97706] font-bold uppercase">Stades phénologiques</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Vert → Tournant → Mûr</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Le passage de vert à tournant déclenche la susceptibilité. Le stade mûr concentre
                la quasi-totalité des pontes et constitue la fenêtre de récolte.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#D97706] font-bold uppercase">Qualité sanitaire</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Piqûres fertiles vs stériles</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Une piqûre fertile conduit à un fruit pourri ou véreux (<Latex math="h_{\text{fertile}} = 0.3054" />).
                Une piqûre stérile ne produit aucune larve et le fruit reste récoltable sain.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <span className="font-mono text-[10px] text-[#D97706] font-bold uppercase">Score cumulé S_rot</span>
              <h4 className="font-serif font-bold text-sm text-[#1B201C]">Loi de pourriture O(1)</h4>
              <p className="text-[11px] text-[#657068] leading-relaxed">
                Formulation fermée évitant les simulations à temps quadratique :{' '}
                <Latex math="S(t) = n + 0.5(nt - \sum c_i) \ge 5.0" />.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          SECTION 3 : HYPOTHÈSES SCIENTIFIQUES FONDAMENTALES DU MODÈLE
         =================================================================== */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#145A3D]" />
          <h3 className="text-sm font-serif font-bold text-[#1B201C]">
            Synthèse des 6 hypothèses agro-écologiques fondamentales
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] space-y-1">
            <strong className="text-[#145A3D]">H1 • Parcelle homogène et échelle 30 :</strong>
            <p className="text-[11px] text-[#657068] leading-tight">
              La parcelle de référence modélise 90 000 fruits (équivalent 1 hectare intensif avec facteur d'échelle 30).
              Le mélange spatial des adultes est supposé parfait au sein du feuillage.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] space-y-1">
            <strong className="text-[#145A3D]">H2 • Capacité de charge biotique K :</strong>
            <p className="text-[11px] text-[#657068] leading-tight">
              En condition non traitée (témoin), la population est freinée par la saturation de la litière
              et la mortalité densité-dépendante, bornée à K = 3 000 adultes sauvages.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[#145A3D]/30 bg-[#EDF5EB] space-y-1">
            <strong className="text-[#145A3D]">H3 • Immigration continue de bordure :</strong>
            <p className="text-[11px] text-[#145A3D] leading-tight">
              Des adultes sauvages immigrent continuellement dans la parcelle depuis les habitats semi-naturels
              bordiers (haies de ronces, forêts), ce qui explique la ré-infestation tardive de la fraise.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] space-y-1">
            <strong className="text-[#145A3D]">H4 • Asymétrie phénologique Fraise vs Cerise :</strong>
            <p className="text-[11px] text-[#657068] leading-tight">
              Fraise : récolte continue sur 100 jours nécessitant une protection soutenue. Cerise : maturation
              groupée sur 25 jours exigeant une inondation TIS synchrone précoce.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] space-y-1">
            <strong className="text-[#145A3D]">H5 • Déterminisme de la ponte sur fruits mûrs :</strong>
            <p className="text-[11px] text-[#657068] leading-tight">
              Les fruits verts ne reçoivent aucune ponte (résistance mécanique). La réceptivité commence au stade
              tournant et devient maximale au stade mûr.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] space-y-1">
            <strong className="text-[#145A3D]">H6 • Préséance spermatique stérile :</strong>
            <p className="text-[11px] text-[#657068] leading-tight">
              En cas d'accouplements successifs, les spermatozoïdes stériles entrent en compétition dans la
              spermathèque avec une efficacité relative calibrée à η_sperm = 0.59.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
