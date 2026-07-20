import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, LineChart, Sparkles, User, AudioLines, ArrowRight, CornerDownRight, 
  CheckCircle2, Database, Network, Megaphone, Brain, Cpu, MessageSquare, 
  Calendar, Mic, ArrowUpRight, Check, Award, Compass, HelpCircle, Terminal,
  FileDown, Loader2, FileText, MapPin, Ticket, Printer, Mail, Eye, EyeOff
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function App() {
  const newsletterRef = React.useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showFutureMaterial, setShowFutureMaterial] = React.useState(false);
  
  const toggleFutureMaterial = () => {
    const nextVal = !showFutureMaterial;
    setShowFutureMaterial(nextVal);
    if (nextVal) {
      setTimeout(() => {
        const el = document.getElementById('section-future-archive');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };
  
  const [referenceNumber] = React.useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `REF-${year}${month}${day}-${hours}${minutes}-V3`;
  });

  const generatePDF = async () => {
    if (!newsletterRef.current) return;
    setIsGenerating(true);
    
    // Ensure Space Grotesk and Inter fonts are fully loaded by the browser environment 
    // before computing canvas metrics for high-fidelity vector rendering
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
    } catch (e) {
      console.warn('Non-blocking font-loading readiness issue:', e);
    }

    // Let React render cycle propagate the static isGenerating changes for clean PDF printing
    await new Promise((resolve) => setTimeout(resolve, 150));
    const element = newsletterRef.current;
    
    const originalGetComputedStyle = window.getComputedStyle;
    const originalAddColorStop = CanvasGradient.prototype.addColorStop;

    // Create a temporary element for color resolution once
    const colorResolverEl = document.createElement('div');
    colorResolverEl.style.display = 'none';
    document.body.appendChild(colorResolverEl);

    const colorCache: Record<string, string> = {};

    // Uses 1x1 canvas 2D context to natively resolve advanced color spaces (OKLCH, OKLAB, color())
    // to standard sRGB rgb() or rgba() values compatible with html2canvas and jsPDF.
    const resolveColor = (colorStr: string) => {
      if (!colorStr) return 'rgb(0, 0, 0)';
      const trimmed = colorStr.trim();
      if (colorCache[trimmed]) return colorCache[trimmed];
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'rgba(0,0,0,0)';
          ctx.fillStyle = trimmed;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
          
          const resultColor = a === 255 
            ? `rgb(${r}, ${g}, ${b})` 
            : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
          
          colorCache[trimmed] = resultColor;
          return resultColor;
        }
      } catch (err) {
        console.warn('Canvas color conversion failed for:', trimmed, err);
      }

      // If canvas fails, try standard inline computed evaluation
      try {
        colorResolverEl.style.color = '';
        colorResolverEl.style.color = trimmed;
        const comp = originalGetComputedStyle.call(window, colorResolverEl).color;
        if (comp && !comp.includes('oklch') && !comp.includes('oklab') && !comp.includes('color(')) {
          colorCache[trimmed] = comp;
          return comp;
        }
      } catch {
        // ignore
      }
      
      // Heuristic fallbacks matching brand colors
      let fallback = 'rgb(128, 128, 128)';
      if (trimmed.includes('0.4578') || trimmed.includes('45.78%') || trimmed.includes('006685')) {
        fallback = 'rgb(0, 102, 133)';
      } else if (trimmed.includes('0.875') || trimmed.includes('87.5%') || trimmed.includes('fbd800')) {
        fallback = 'rgb(251, 216, 0)';
      } else if (trimmed.includes('0.03') || trimmed.includes('3%') || trimmed.includes('0.98') || trimmed.includes('98%')) {
        fallback = 'rgb(248, 250, 252)';
      } else if (trimmed.includes('0.1')) {
        fallback = 'rgb(15, 23, 42)';
      } else if (trimmed.includes('0.95') || trimmed.includes('95%')) {
        fallback = 'rgb(251, 249, 248)';
      }
      colorCache[trimmed] = fallback;
      return fallback;
    };

    // Safely parses styles to replace modern colors without risk of infinite loops
    const cleanStyleValue = (val: string) => {
      if (!val) return '';
      if (!val.includes('oklch') && !val.includes('oklab') && !val.includes('color(')) {
        return val;
      }
      
      let result = val;
      const targets = ['oklch(', 'oklab(', 'color('];
      for (const target of targets) {
        let searchIndex = 0;
        let idx = result.indexOf(target, searchIndex);
        while (idx !== -1) {
          let parenCount = 1;
          let j = idx + target.length;
          while (j < result.length && parenCount > 0) {
            if (result[j] === '(') parenCount++;
            else if (result[j] === ')') parenCount--;
            j++;
          }
          const before = result.substring(0, idx);
          const after = result.substring(j);
          const colorStr = result.substring(idx, j);
          
          const replacement = resolveColor(colorStr);
          result = before + replacement + after;
          
          // Advance past the replacement to guarantee no double matching / infinite loops
          searchIndex = idx + replacement.length;
          idx = result.indexOf(target, searchIndex);
        }
      }
      return result;
    };

    const makeStyleProxy = (style: CSSStyleDeclaration) => {
      return new Proxy(style, {
        get(target, prop) {
          if (prop === 'getPropertyValue') {
            return function(propertyName: string) {
              const val = target.getPropertyValue(propertyName);
              if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
                return cleanStyleValue(val);
              }
              return val;
            };
          }
          
          const val = Reflect.get(target, prop);
          if (typeof val === 'function') {
            return val.bind(target);
          }
          if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
            return cleanStyleValue(val);
          }
          return val;
        }
      });
    };

    const styleTags = Array.from(document.querySelectorAll('style'));
    const originalStyleContentsByTag = styleTags.map(tag => tag.textContent || '');
    
    const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    const tempStyleBlocks: HTMLStyleElement[] = [];

    try {
      // Add printable class to the parent container during screenshot preparation
      element.classList.add('static-print-mode', 'is-printing');

      // Intrusively intercept addColorStop on the native CanvasGradient prototype to avoid non-finite and range error crashes
      CanvasGradient.prototype.addColorStop = function(offset, color) {
        if (typeof offset !== 'number' || isNaN(offset) || !isFinite(offset)) {
          console.warn('Prevented NaN/non-finite offset in addColorStop:', offset, color);
          return;
        }
        const clampedOffset = Math.max(0, Math.min(1, offset));
        try {
          originalAddColorStop.call(this, clampedOffset, color);
        } catch (err) {
          console.warn('Filtered canvas gradient color stop issue:', err);
        }
      };

      // 1. Temporarily replace oklch/oklab/color with standard color functions in original style tags
      styleTags.forEach(tag => {
        if (tag.textContent) {
          tag.textContent = cleanStyleValue(tag.textContent);
        }
      });

      // 2. Inline, clean, and temporarily replace active same-origin link stylesheets in parent window
      linkElements.forEach(linkEl => {
        try {
          const href = linkEl.getAttribute('href');
          if (!href) return;

          const matchingSheet = Array.from(document.styleSheets).find(
            (sheet) => sheet.href && sheet.href.includes(href)
          );

          if (matchingSheet) {
            let inlineCSS = '';
            try {
              const rules = matchingSheet.cssRules || matchingSheet.rules;
              if (rules) {
                for (let i = 0; i < rules.length; i++) {
                  inlineCSS += rules[i].cssText + '\n';
                }
              }
            } catch {
              // ignore CORS
            }

            if (inlineCSS) {
              const cleanedCSS = cleanStyleValue(inlineCSS);
              const newStyle = document.createElement('style');
              newStyle.textContent = cleanedCSS;
              document.head.appendChild(newStyle);
              tempStyleBlocks.push(newStyle);
              
              // Disable the link so html2canvas doesn't query the original uncleaned styles
              linkEl.disabled = true;
            }
          }
        } catch (err) {
          console.warn('Failed to clean parent linked stylesheet:', err);
        }
      });

      // 3. Override parent window getComputedStyle during html2canvas render pass
      window.getComputedStyle = function(el: Element, pseudoElt?: string | null) {
        const style = originalGetComputedStyle.call(window, el, pseudoElt);
        return makeStyleProxy(style);
      } as any;

      // Assign temporary attribute to locate the root element in the clone
      element.setAttribute('data-pdf-root', 'true');

      // Setup windowWidth to force a uniform high-fidelity tablet/desktop layout width
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#fcf9f8',
        windowWidth: 1120, // Lock the rendering viewport width to 1120px regardless of user screen size
        onclone: (clonedDoc) => {
          // 1. Clean all `<style>` elements in clone
          clonedDoc.querySelectorAll('style').forEach(styleEl => {
            try {
              if (styleEl.textContent) {
                styleEl.textContent = cleanStyleValue(styleEl.textContent);
              }
            } catch (err) {
              console.warn('Failed to clean style tag contents:', err);
            }
          });

          // 2. Parse and inline CSS rules from linked stylesheets so they are safe in the clone
          clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(linkEl => {
            try {
              const href = linkEl.getAttribute('href');
              if (!href) return;

              const matchingSheet = Array.from(document.styleSheets).find(
                (sheet) => sheet.href && sheet.href.includes(href)
              );

              if (matchingSheet) {
                let inlineCSS = '';
                try {
                  const rules = matchingSheet.cssRules || matchingSheet.rules;
                  if (rules) {
                    for (let i = 0; i < rules.length; i++) {
                      inlineCSS += rules[i].cssText + '\n';
                    }
                  }
                } catch {
                  // ignore cors
                }

                if (inlineCSS) {
                  const cleanedCSS = cleanStyleValue(inlineCSS);
                  const newStyle = clonedDoc.createElement('style');
                  newStyle.textContent = cleanedCSS;
                  clonedDoc.head.appendChild(newStyle);
                  linkEl.parentNode?.removeChild(linkEl);
                }
              }
            } catch (err) {
              console.warn('Failed to inline linked stylesheet:', err);
            }
          });

          // 3. Override getComputedStyle of the cloned document window to intercept and clean on the fly
          if (clonedDoc.defaultView) {
            const originalClonedGetComputedStyle = clonedDoc.defaultView.getComputedStyle;
            
            clonedDoc.defaultView.getComputedStyle = function(el: Element, pseudoElt?: string | null) {
              const style = originalClonedGetComputedStyle.call(clonedDoc.defaultView, el, pseudoElt);
              return makeStyleProxy(style);
            };
          }

          // 4. Force print mode classes, custom desktop width, and strip modern colors on cloned root
          const clonedRoot = clonedDoc.querySelector('[data-pdf-root="true"]') as HTMLElement;
          if (clonedRoot) {
            clonedRoot.classList.add('static-print-mode', 'is-printing');
            clonedRoot.style.width = '1120px';
            clonedRoot.style.maxWidth = '1120px';
            clonedRoot.style.minWidth = '1120px';
            clonedRoot.style.margin = '0 auto';

            const traverseAndClean = (el: HTMLElement) => {
              if (!el) return;
              if (el.style) {
                for (let i = 0; i < el.style.length; i++) {
                  const key = el.style[i];
                  const val = el.style.getPropertyValue(key);
                  if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
                    el.style.setProperty(key, cleanStyleValue(val));
                  }
                }
              }
              for (let i = 0; i < el.children.length; i++) {
                traverseAndClean(el.children[i] as HTMLElement);
              }
            };
            traverseAndClean(clonedRoot);
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const elementWidth = canvas.width;
      const elementHeight = canvas.height;
      
      const pdfPageWidth = 1120; // Exact fit dimension for standard locked rendering width
      const pdfPageHeight = (elementHeight * pdfPageWidth) / elementWidth;
      
      const pdf = new jsPDF({
        orientation: pdfPageHeight > pdfPageWidth ? 'portrait' : 'landscape',
        unit: 'pt',
        format: [pdfPageWidth, pdfPageHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfPageWidth, pdfPageHeight, undefined, 'FAST');
      pdf.save('Silicon_Comte_Newsletter_No3.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      element.removeAttribute('data-pdf-root');
      element.classList.remove('static-print-mode', 'is-printing');
      
      // Restore CanvasGradient.prototype.addColorStop
      CanvasGradient.prototype.addColorStop = originalAddColorStop;

      // Restore parent window's getComputedStyle
      window.getComputedStyle = originalGetComputedStyle;
      
      // Restore parent window's style block rules
      styleTags.forEach((tag, idx) => {
        tag.textContent = originalStyleContentsByTag[idx];
      });

      // Restore/Re-enable parent window's link elements
      linkElements.forEach(link => {
        link.disabled = false;
      });

      // Clean up parent window's temporary style blocks
      tempStyleBlocks.forEach(block => {
        block.parentNode?.removeChild(block);
      });

      // Clear the temporary color cache elements
      if (colorResolverEl.parentNode) {
        colorResolverEl.parentNode.removeChild(colorResolverEl);
      }

      setIsGenerating(false);
    }
  };

  const generateMarkdown = () => {
    const mdContent = `# Silicon Comté — Édition N°3 (Juin 2026)
L'Écosystème : Le Guide de l'Innovation Numérique en BFC

---

## Le Mot du Président (Antoine Bouet)

**"Apprenons à nous connaître pour mieux nous valoriser !"**

L'association Silicon Comté se redynamise avec une énergie nouvelle et une ambition forte. Notre priorité absolue est claire : fédérer l'ensemble de l'écosystème numérique local de Franche-Comté en remettant l'événementiel, le partage d'expertise et l'innovation au cœur de nos actions. La richesse de nos récents rendez-vous a créé un véritable élan, et c'est en nous réunissant que nous continuerons de créer de la valeur pour notre territoire.

Cette année, notre engagement s'accélère. Nous faisons de l'adoption de l'Intelligence Artificielle un axe majeur de notre développement, la considérant comme un véritable "super-pouvoir" pour nos membres. Cette volonté se traduit par nos rencontres mensuelles "Apéros IA" au Ninkasi, ainsi que par la refonte de notre annuaire des compétences. Désormais automatisé par l'IA, cet outil a vocation d'observatoire du numérique local.

En rejoignant Silicon Comté, nos membres bénéficient d'une multitude d'avantages exclusifs conçus pour accélérer leur croissance. De la mise en valeur prioritaire de vos expertises au sein de notre nouvel annuaire à l'opportunité d'animer nos célèbres Digital Apéros, nous créons des espaces uniques d'échange. Ce réseau dynamique favorise les synergies d'affaires, le partage de bonnes pratiques sur les technologies de pointe, et multiplie les opportunités de networking de haut niveau pour propulser ensemble la visibilité de nos talents régionaux.

Enfin, pour offrir un canal d'expression d'excellence à nos membres, nous lançons notre nouveau Blog média, vitrine éditoriale et technique indispensable pour valoriser nos savoir-faire.

Rejoignez-nous dans cette dynamique collective !

---

## Actualités du Conseil d'administration

### Projet Majeur N°1 : Annuaire des Compétences — Le nouveau cœur battant de notre écosystème
Identifié comme l'outil prioritaire pour fédérer notre communauté, notre Annuaire des Compétences fait peau neuve pour devenir un véritable observatoire du numérique local. Ouvert à tous les acteurs du numérique de la région (entreprises, indépendants ou étudiants), ce projet incarne notre devise : "se connaître pour se faire connaître".

Pour garantir une plateforme moderne, sa création et sa gestion sont désormais automatisées. Afin d'offrir une clarté maximale, nous imposons une limite stricte de deux compétences phares par profil pour garantir une expertise ciblée.

De plus, la fiabilité des données est notre priorité : vérification par API via le numéro SIRET et modération régulière garantissent un ancrage sérieux en Franche-Comté.

De plus, nos membres bénéficient d'avantages exclusifs : l'ajout d'un "badge adhérent" officiel et l'intégration d'un backlink certifié pointant vers leur site pour leur propre SEO.

### Relais Info N°3 : Nouvelle Dynamique de Communication — Des outils repensés pour vous connecter
Afin de fluidifier nos échanges, nous concentrons nos efforts là où notre écosystème est le plus actif : notre page LinkedIn officielle pour la visibilité externe.

En parallèle, préparez-vous pour le lancement officiel de notre nouveau Blog destiné à relayer la richesse des témoignages et expertises de haut vol de nos membres.

---

## Pourquoi nous joindre ? Valoriser l'Adhésion

1. **Badge Adhérent exclusif** : Sceau numérique officiel de labellisation à intégrer sur votre site et vos communications pour affirmer votre ancrage.
2. **Référencement (backlinks) dans l'annuaire** : Boostez votre SEO technique grâce à un lien web certifié provenant du site officiel Silicon Comté, indexé pour rassurer vos prospects.
3. **Accueillir un Digital Apéro** : Une occasion unique de recevoir l'ensemble de l'écosystème numérique réunissant plus de 40 décideurs dans vos propres locaux.
4. **Pot de Rentrée réservé** : Accès exclusif et privé à nos grands rassemblements informels de networking de début de saison pour nouer des liens solides.
5. **Mise en avant Interview** : Une opportunité d'être interviewé et mis en valeur dans la newsletter (à l'image de celui ci-après) pour promouvoir vos succès et votre savoir-faire.

---

## Fête de l'Innovation 2026 — Grand Événement Régional

L'Association Silicon Comté et La Fabrique Numérique Besançon, l'AER BFC, le Village by CA, DECA BFC et La French Tech BFC, ont le plaisir de vous inviter à la Fête de l'Innovation 2026 !

- **Date** : Vendredi 26 juin 2026, de 13h à 18h
- **Lieu** : Espace Grammont – 20 rue Mégevand, Besançon
- **Soutiens** : Grand Besançon Métropole et la Région Bourgogne-Franche-Comté

Chaque année, cet événement met à l'honneur l'innovation, l'entrepreneuriat et le numérique sur notre territoire pour favoriser les rencontres, les collaborations et l'émergence de nouveaux projets.

### Programme Officiel :
- **13h00** : Accueil et discours d'ouverture & annonce de la labellisation French Tech Besançon.
- **13h30** : Pitchs de start-up locales innovantes.
- **14h30** : Table ronde « Recherche publique, entrepreneuriat et entreprises numériques : quelles synergies ? » animée par Sylvain Compagnon (DECA BFC).
- **15h30** : Pitchs partenaires (structures d'accompagnement, financement, formation).
- **16h30** : Buffet et netwoking de haut niveau (Rendez-vous BtoB inclus).

Inscription gratuite mais obligatoire : https://fete-innovation.make-an-event.com

---

## L'Entretien Décryptage (Entretien Exclusif)
**Invité : Nicholas Goodwin**
*Conseil, transformation numérique et systèmes d'information chez Ebilyse.*

- **Silicon Comté : Nicholas, pouvez-vous nous présenter Ebilyse et votre parcours ?**
  - **Nicholas Goodwin** : D'origine britannique, je bénéficie de plus de 40 années d'expérience dans des entreprises internationales, avec une spécialisation en informatique, marketing et communication. Avec Françoise Goodwin Hillier, experte en gestion d'entreprise et ressources humaines, nous avons créé Ebilyse. Notre mission est de proposer du conseil et un accompagnement sur mesure pour les artisans, TPE/PME et jeunes entreprises. Notre objectif est simple : leur faire gagner du temps pour qu'ils puissent se concentrer sur leur cœur de métier et augmenter leur rentabilité.

- **Silicon Comté : Vous êtes membre de Silicon Comté depuis la création de l'association. Qu'est-ce qui vous a motivé à y adhérer dès le départ ?**
  - **Nicholas Goodwin** : La mise en relation d'affaires et le réseau sont au cœur de notre ADN, au même titre en relation de confiance et en prenant soin de nos partenaires de Besançon. Pour une entreprise comme la nôtre, qui accompagne les acteurs locaux dans leur numérisation, il était indispensable de faire partie d'un collectif qui fédère l'écosystème numérique. Rompre l'isolement des petites structures et partager des visions innovantes fait partie de nos priorités.

- **Silicon Comté : Vous participez très régulièrement à nos différents événements. Que venez-vous y chercher en tant que chef d'entreprise ?**
  - **Nicholas Goodwin** : J’y trouve une formidable source d'idées et d'expérience. Ces rencontres permettent de puiser de l'inspiration non seulement auprès des autres membres, mais aussi des dynamiques du Grand Besançon et du monde technologique en général. C'est l'occasion d'échanger sur de nouvelles idées et de découvrir des outils qui peuvent transformer notre façon de travailler.

- **Silicon Comté : Récemment, vous avez franchi un cap supplémentaire en rejoignant le Conseil d'Administration et en prenant la direction de la commission Newsletter. Qu'est-ce qui a motivé cet engagement plus profond ?**
  - **Nicholas Goodwin** : Je souhaitais m'impliquer pour mettre en lumière les progrès, la croissance et l'enthousiasme grandissant au sein de notre association. En reprenant l'édition de cette newsletter mensuelle en français, mon ambition est de partager des informations utiles et intrigantes pour nos lecteurs. De plus, c'est l'occasion idéale d'utiliser concrètement l'IA comme un véritable "super-pouvoir" pour nos formats.

---

## Événements à ne pas manquer (Agenda des Rencontres)

- **20 Juin - Afterwork Networking** (Thème : BFC Numérique)
  - *Concept* : Célébrons la cohésion dynamique de l'écosystème avec notre partenaire BFC Numérique pour clôturer le trimestre estival.
- **26 Juin - Fête de l'Innovation 2026**
  - *Lieu* : Espace Grammont, Besançon. Grand rassemblement régional d'innovation, pitchs et networking.
- **21 Juillet - Apéros IA** (Thème : Au Ninkasi)
  - *Format* : Informel de 45 min à 1h pour échanger de manière collective autour des nouveautés IA de la région, tester des outils et partager des compilations de prompts.
- **15 Septembre - Digital Apéro** (Thème : IA Agentique & Éthique)
  - *Lieu* : Le Comptoir Général. Conférence de 30–45 minutes pour une trentaine de personnes, suivie d'un apéritif convivial.

---

## Rejoignez l'impulsion de l'innovation

Devenez acteur du dynamisme numérique en Franche-Comté ! Que vous soyez une entreprise, un indépendant, une startup ou un étudiant, adhérer à Silicon Comté vous permet de participer à nos rencontres, de figurer dans l'annuaire des compétences, de booster votre visibilité et de rejoindre un réseau solidaire et innovant.

[S'INSCRIRE / RENOUVELER L'ADHÉSION](https://www.siliconcomte.com)

---
© 2026 SILICON COMTÉ. TOUS DROITS RÉSERVÉS.

<!-- FOR-FUTURE-USE
### Alchimie Digitale N°2 : La Force du Collectif — La Révolution de la Co-Adhésion
L'union fait la force ! C’est pourquoi nous lançons le projet stratégique de "co-adhésion". Cette initiative vise à créer une passerelle unique et fluide entre trois piliers du territoire pour simplifier l'accès administratif et financier :
- **Silicon Comté** : Rencontres de terrain, Digital Apéros, ateliers.
- **La French Tech BFC** : Accès aux programmes nationaux (Next40/120, Tremplin), visibilité.
- **La Fabrique Numérique de Besançon** : Formation professionnelle, inclusion numérique et pôle d'innovation.

Une seule cotisation pour trois fois plus d'opportunités de networking et d'impact !

## Repenser le Développement avec l'IA : Un nouveau "Super-Pouvoir"

### IA Agentique & Éthique : Apprenez à co-piloter vos projets avec l'IA
Adoptez l'adoption de l'IA pour automatiser vos tâches récurrentes tout en respectant une charte éthique stricte de souveraineté des données.
Découvrez des cas d'usage réels, apprenez à formuler des requêtes complexes, et optimisez votre flux quotidien sans compromettre la sécurité.

Le Mot du Président (paragraphe déplacé) :
Par ailleurs, nous œuvrons activement à la simplification de notre écosystème grâce au projet de "co-adhésion" que nous lançons en partenariat avec La French Tech BFC et la Fabrique Numérique de Besançon. Notre objectif est de proposer un guichet unique, simple et fort pour tous les entrepreneurs locaux.
-->
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Silicon_Comte_Newsletter_No3.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateHtmlEmail = () => {
    const origin = window.location.origin || 'https://ais-dev-ww4l5gy47hwcanbxbszybi-314939323086.europe-west2.run.app';
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Silicon Comté Newsletter — Édition N°3</title>
  <style>
    /* Clean media query overrides for responsive modern layouts */
    @media only screen and (max-width: 620px) {
      .responsive-table {
        width: 100% !important;
        min-width: 100% !important;
      }
      .responsive-image {
        width: 100% !important;
        height: auto !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .mobile-padding {
        padding: 24px !important;
      }
      .mobile-center {
        text-align: center !important;
        margin: 0 auto !important;
      }
    }
    @media print {
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0c111d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0c111d; padding: 40px 0 60px 0;">
    <tr>
      <td align="center">
        <!-- Main Email Container Envelope Frame (640px) -->
        <table border="0" cellpadding="0" cellspacing="0" width="640" class="responsive-table" style="background-color: #fcf9f8; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.4); border: 1px solid #1e293b;">
          
          <!-- TOP BANNER ACCENT -->
          <tr>
            <td style="background-color: #006685; height: 8px; font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- WHITE NAVBAR LOGO BAR BRAND HIGHLIGHT -->
          <tr>
            <td style="background-color: #ffffff; padding: 24px 40px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <img src="${origin}/logo-siliconcomte.png" alt="Silicon Comté" style="max-width: 200px; height: auto;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BRAND COVER HEADER BLOCK -->
          <tr>
            <td style="background-color: #090d16; padding: 45px 40px 40px 40px; border-bottom: 4px solid #fbd800;" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="color: #94a3b8; font-size: 12px; font-weight: 800; font-family: SFMono-Regular, Consolas, monospace; letter-spacing: 2.5px;">
                    SILICON COMTÉ NEWSLETTER
                  </td>
                  <td align="right" style="background-color: #fbd800; color: #090d16; font-size: 10px; font-weight: 950; padding: 4px 12px; border-radius: 4px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                    ÉDITION N°3
                  </td>
                </tr>
              </table>
              
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 25px 0 10px 0; letter-spacing: -1.5px; text-transform: uppercase; line-height: 1.15; font-family: sans-serif;">
                Silicon Comté <br><span style="color: #fbd800;">L'Écosystème</span>
              </h1>
              <p style="color: #94a3b8; font-size: 15px; margin: 0 0 10px 0; font-weight: 300; line-height: 1.4; max-width: 480px; font-family: sans-serif;">
                Le Guide de l'Innovation Numérique en Bourgogne-Franche-Comté
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr>
                  <td style="border-top: 1px solid #1e293b; padding-top: 15px; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-family: SFMono-Regular, Consolas, monospace;">
                    Bulletin Mensuel • Juin 2026
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 1. LE MOT DU PRÉSIDENT -->
          <tr>
            <td style="padding: 40px; background-color: #fcf9f8;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <!-- President photo left-floated card -->
                    <table border="0" cellpadding="0" cellspacing="0" align="left" style="margin-right: 25px; margin-bottom: 20px;" class="responsive-table mobile-center">
                      <tr>
                        <td align="center" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 15px; box-shadow: 0 8px 16px rgba(0,0,0,0.03);">
                          <img src="${origin}/antoine_bouet.png" alt="Antoine Bouet" width="110" height="110" style="border-radius: 50%; border: 3px solid #006685; display: block; object-fit: cover;" />
                          <div style="margin-top: 12px; font-size: 14px; font-weight: bold; color: #0f172a; font-family: sans-serif;">Antoine Bouet</div>
                          <div style="font-size: 9px; color: #006685; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; font-family: monospace; margin-top: 3px;">Président</div>
                        </td>
                      </tr>
                    </table>
                    
                    <h2 style="color: #006685; font-size: 24px; font-weight: 900; margin-top: 0; margin-bottom: 20px; line-height: 1.25; letter-spacing: -0.5px; font-family: sans-serif;">
                      Le Mot du Président
                    </h2>
                    
                    <div style="border-left: 4px solid #fbd800; margin: 0 0 25px 0; padding-left: 20px; font-style: italic; font-size: 17px; color: #0f172a; font-weight: 600; line-height: 1.5; font-family: Georgia, serif;">
                      "Apprenons à nous connaître pour mieux nous valoriser !"
                    </div>
                    
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.65; margin: 0 0 16px 0; font-family: sans-serif;">
                      L'association Silicon Comté se redynamise avec une énergie nouvelle et une ambition forte. Notre priorité absolue est claire : fédérer l'ensemble de l'écosystème numérique local de Franche-Comté en remettant l'événementiel, le partage d'expertise et l'innovation au cœur de nos actions. La richesse de nos récents rendez-vous a créé un véritable élan, et c'est en nous réunissant que nous continuerons de créer de la valeur pour notre territoire.
                    </p>
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.65; margin: 0 0 16px 0; font-family: sans-serif;">
                      Cette année, notre engagement s'accélère. Nous faisons de l'adoption de l'Intelligence Artificielle un axe majeur de notre développement, la considérant comme un véritable "super-pouvoir" pour nos membres. Cette volonté se traduit par nos rencontres mensuelles "Apéros IA" au Ninkasi, ainsi que par la refonte de notre annuaire des compétences. Désormais automatisé par l'IA, cet outil a vocation d'observatoire du numérique local.
                    </p>
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.65; margin: 0 0 16px 0; font-family: sans-serif;">
                      En rejoignant Silicon Comté, nos membres bénéficient d'une multitude d'avantages exclusifs conçus pour accélérer leur croissance. De la mise en valeur prioritaire de vos expertises au sein de notre nouvel annuaire à l'opportunité d'animer nos célèbres Digital Apéros, nous créons des espaces uniques d'échange. Ce réseau dynamique favorise les synergies d'affaires, le partage de bonnes pratiques sur les technologies de pointe, et multiplie les opportunités de networking de haut niveau pour propulser ensemble la visibilité de nos talents régionaux.
                    </p>
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.65; margin: 0 0 16px 0; font-family: sans-serif;">
                      Enfin, pour offrir un canal d'expression d'excellence à nos membres, nous lançons notre nouveau Blog média, vitrine éditoriale et technique indispensable pour valoriser nos savoir-faire.
                    </p>
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.65; margin: 0; font-weight: bold; font-family: sans-serif;">
                      Rejoignez-nous dans cette dynamique collective !
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. ACTUALITÉS DU CA (NAVY/DARK BLUE SECTION) -->
          <tr>
            <td style="background-color: #090d16; padding: 45px 40px; border-bottom: 2px solid #1e293b;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="color: #006685; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-family: monospace; display: block; margin-bottom: 6px;">
                      // ACTIONS & CHANTIERS DE L'ÉCOSYSTÈME
                    </span>
                    <h2 style="color: #ffffff; font-size: 26px; font-weight: 900; margin-top: 0; margin-bottom: 30px; text-transform: uppercase; font-family: sans-serif; letter-spacing: -0.5px;">
                      Actualités du Conseil d'administration
                    </h2>
                    
                    <!-- WORK ITEM 3: COMMUNICATION (EXACT COPY OF LinkedIn & Blog PARAGRAPHS) -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid #1f2937; border-left: 4px solid #10b981; border-radius: 18px; margin-bottom: 25px;">
                      <tr>
                        <td style="padding: 28px;">
                          <div style="font-family: monospace; color: #10b981; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                            COMMUNICATION DIGITALE // LINKEDIN & PORTAIL
                          </div>
                          <h3 style="color: #ffffff; font-size: 18px; font-weight: 850; margin: 0 0 16px 0; font-family: sans-serif; line-height: 1.35;">
                            Relais Info N°3 : Nouvelle Dynamique de Communication — Des outils repensés pour vous connecter
                          </h3>
                          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0; font-family: sans-serif;">
                            Afin de fluidifier nos échanges, nous concentrons nos efforts là où notre écosystème est le plus actif : notre page LinkedIn officielle pour la visibilité externe.
                          </p>
                          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; font-family: sans-serif;">
                            En parallèle, préparez-vous pour le lancement officiel de notre nouveau Blog destiné à relayer la richesse des témoignages et expertises de haut vol de nos membres.
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- WORK ITEM 1: ANNUAIRE DE COMPÉTENCES (EXACT COPY OF ALL 4 PARAGRAPHS) -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid #1f2937; border-left: 4px solid #006685; border-radius: 18px;">
                      <tr>
                        <td style="padding: 28px;">
                          <div style="font-family: monospace; color: #006685; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                            PROJET CRITIQUE N°1 // DIGITAL CARD
                          </div>
                          <h3 style="color: #ffffff; font-size: 18px; font-weight: 850; margin: 0 0 16px 0; font-family: sans-serif; line-height: 1.35;">
                            Projet Majeur N°1 : Annuaire des Compétences — Le nouveau cœur battant de notre écosystème
                          </h3>
                          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0; font-family: sans-serif;">
                            Identifié comme l'outil prioritaire pour fédérer notre communauté, notre Annuaire des Compétences fait peau neuve pour devenir un véritable observatoire du numérique local. Ouvert à tous les acteurs du numérique de la région (entreprises, indépendants ou étudiants), ce projet incarne notre devise : "se connaître pour se faire connaître".
                          </p>
                          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0; font-family: sans-serif;">
                            Pour garantir une plateforme moderne, sa création et sa gestion sont désormais automatisées. Afin d'offrir une clarté maximale, nous imposons une limite stricte de deux compétences phares par profil pour garantir une expertise ciblée.
                          </p>
                          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0; font-family: sans-serif;">
                            De plus, la fiabilité des données est notre priorité : vérification par API via le numéro SIRET et modération régulière garantissent un ancrage sérieux en Franche-Comté.
                          </p>
                          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; font-family: sans-serif;">
                            De plus, nos membres bénéficient d'avantages exclusifs : l'ajout d'un "badge adhérent" officiel et l'intégration d'un backlink certifié pointant vers leur site pour leur propre SEO.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>



          <!-- 4. POURQUOI NOUS JOINDRE ? (LIGHT BG CELL WITH ALL 5 BULLETS FULL TEXT) -->
          <tr>
            <td style="padding: 40px; background-color: #ffffff;" class="mobile-padding">
              <span style="font-family: monospace; color: #006685; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 4px;">
                // ADHÉREZ & PARTAGEZ L'EXCELLENCE
              </span>
              <h2 style="color: #090d16; font-size: 24px; font-weight: 900; margin-top: 0; margin-bottom: 12px; font-family: sans-serif; letter-spacing: -0.5px;">
                Pourquoi nous joindre ? Valoriser l'Adhésion
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 30px; font-family: sans-serif;">
                Bénéficiez immédiatement de retombées directes sur votre visibilité, votre réputation locale et votre croissance numérique régionale.
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <!-- ADVANTAGE 1 -->
                <tr>
                  <td style="padding-bottom: 22px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="top" align="center">
                          <div style="background-color: #006685; color: #ffffff; width: 26px; height: 26px; line-height: 26px; font-size: 13px; font-weight: bold; border-radius: 50%; text-align: center; font-family: sans-serif;">1</div>
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.55; color: #334155; font-family: sans-serif;">
                          <strong style="color: #090d16;">Badge Adhérent exclusif :</strong> Sceau numérique officiel de labellisation à intégrer sur votre site et vos communications pour affirmer votre ancrage.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- ADVANTAGE 2 -->
                <tr>
                  <td style="padding-bottom: 22px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="top" align="center">
                          <div style="background-color: #006685; color: #ffffff; width: 26px; height: 26px; line-height: 26px; font-size: 13px; font-weight: bold; border-radius: 50%; text-align: center; font-family: sans-serif;">2</div>
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.55; color: #334155; font-family: sans-serif;">
                          <strong style="color: #090d16;">Référencement (backlinks) dans l'annuaire :</strong> Boostez votre SEO technique grâce à un lien web certifié provenant du site officiel Silicon Comté, indexé pour rassurer vos prospects.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- ADVANTAGE 3 -->
                <tr>
                  <td style="padding-bottom: 22px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="top" align="center">
                          <div style="background-color: #006685; color: #ffffff; width: 26px; height: 26px; line-height: 26px; font-size: 13px; font-weight: bold; border-radius: 50%; text-align: center; font-family: sans-serif;">3</div>
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.55; color: #334155; font-family: sans-serif;">
                          <strong style="color: #090d16;">Accueillir un Digital Apéro :</strong> Une occasion unique de recevoir l'ensemble de l'écosystème numérique réunissant plus de 40 décideurs dans vos propres locaux.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- ADVANTAGE 4 -->
                <tr>
                  <td style="padding-bottom: 22px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="top" align="center">
                          <div style="background-color: #006685; color: #ffffff; width: 26px; height: 26px; line-height: 26px; font-size: 13px; font-weight: bold; border-radius: 50%; text-align: center; font-family: sans-serif;">4</div>
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.55; color: #334155; font-family: sans-serif;">
                          <strong style="color: #090d16;">Pot de Rentrée réservé :</strong> Accès exclusif et privé à nos grands rassemblements informels de networking de début de saison pour nouer des liens solides.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- ADVANTAGE 5 -->
                <tr>
                  <td style="padding-bottom: 5px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="top" align="center">
                          <div style="background-color: #006685; color: #ffffff; width: 26px; height: 26px; line-height: 26px; font-size: 13px; font-weight: bold; border-radius: 50%; text-align: center; font-family: sans-serif;">5</div>
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.55; color: #334155; font-family: sans-serif;">
                          <strong style="color: #090d16;">Mise en avant Interview :</strong> Une opportunité d'être interviewé et mis en valeur dans la newsletter (à l'image de celui ci-après) pour promouvoir vos succès et votre savoir-faire.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4.5 FÊTE DE L'INNOVATION 2026 SPOTLIGHT (YELLOW & BLACK HIGH CONTRAST) -->
          <tr>
            <td style="background-color: #090d16; padding: 45px; border-top: 5px solid #fbd800;" class="mobile-padding" align="center">
              <span style="font-family: monospace; border: 1px solid #fbd800; color: #fbd800; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px;">
                GRAND ÉVÉNEMENT RÉGIONAL // BESANÇON
              </span>
              
              <h2 style="color: #ffffff; font-size: 28px; font-weight: 900; margin-top: 20px; margin-bottom: 12px; text-transform: uppercase; font-family: sans-serif; letter-spacing: -0.5px; line-height: 1.15;">
                Fête de l'Innovation 2026
              </h2>
              
              <p style="color: #cbd5e1; font-size: 14.5px; line-height: 1.6; max-width: 530px; margin-top: 0; margin-bottom: 25px; font-family: sans-serif;">
                L'Association Silicon Comté et La Fabrique Numérique Besançon, l'AER BFC, le Village by CA, DECA BFC et La French Tech BFC, ont le plaisir de vous inviter à la Fête de l'Innovation 2026 !
              </p>
              
              <!-- INFO BAR -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b; padding: 15px 0;">
                <tr>
                  <td align="center">
                    <div style="font-family: sans-serif; font-size: 14px; color: #ffffff; margin-bottom: 6px;">
                      📅 <strong style="color: #fbd800;">Date :</strong> Vendredi 26 juin 2026, de 13h à 18h
                    </div>
                    <div style="font-family: sans-serif; font-size: 14px; color: #ffffff; margin-bottom: 6px;">
                      📍 <strong style="color: #fbd800;">Lieu :</strong> Espace Grammont – 20 rue Mégevand, Besançon
                    </div>
                    <div style="font-family: sans-serif; font-size: 14px; color: #ffffff;">
                      🏢 <strong style="color: #fbd800;">Soutiens :</strong> Grand Besançon Métropole et la Région Bourgogne-Franche-Comté
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: #94a3b8; font-size: 13.5px; line-height: 1.6; max-width: 530px; margin-top: 0; margin-bottom: 30px; font-family: sans-serif; text-align: left;">
                Chaque année, cet événement met à l'honneur l'innovation, l'entrepreneuriat et le numérique sur notre territoire pour favoriser les rencontres, les collaborations et l'émergence de nouveaux projets.
              </p>

              <!-- OFFICIAL PROGRAM TABLE IN SPOTLIGHT CARD -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border-radius: 12px; margin-bottom: 30px; padding: 20px; text-align: left;">
                <tr>
                  <td style="padding-bottom: 12px; border-bottom: 1px solid #1e293b;">
                    <strong style="color: #fbd800; font-family: monospace; font-size: 13px;">PROGRAMME OFFICIEL :</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-family: sans-serif; font-size: 13px; color: #cbd5e1; border-bottom: 1px solid #1e293b;">
                    <strong style="color: #ffffff; font-family: monospace; font-size: 12.5px; margin-right: 10px;">13h00</strong> Accueil et discours d'ouverture & annonce de la labellisation French Tech Besançon.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-family: sans-serif; font-size: 13px; color: #cbd5e1; border-bottom: 1px solid #1e293b;">
                    <strong style="color: #ffffff; font-family: monospace; font-size: 12.5px; margin-right: 10px;">13h30</strong> Pitchs de start-up locales innovantes.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-family: sans-serif; font-size: 13px; color: #cbd5e1; border-bottom: 1px solid #1e293b;">
                    <strong style="color: #ffffff; font-family: monospace; font-size: 12.5px; margin-right: 10px;">14h30</strong> Table ronde « Recherche publique, entrepreneuriat et entreprises numériques : quelles synergies ? » animée par Sylvain Compagnon (DECA BFC).
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-family: sans-serif; font-size: 13px; color: #cbd5e1; border-bottom: 1px solid #1e293b;">
                    <strong style="color: #ffffff; font-family: monospace; font-size: 12.5px; margin-right: 10px;">15h30</strong> Pitchs partenaires (structures d'accompagnement, financement, formation).
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-family: sans-serif; font-size: 13px; color: #cbd5e1;">
                    <strong style="color: #ffffff; font-family: monospace; font-size: 12.5px; margin-right: 10px;">16h30</strong> Buffet et networking de haut niveau (Rendez-vous BtoB inclus).
                  </td>
                </tr>
              </table>

              <!-- CTA BUTTON -->
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #fbd800; border-radius: 12px; box-shadow: 0 10px 25px rgba(251,216,0,0.25);">
                    <a href="https://fete-innovation.make-an-event.com" target="_blank" style="font-family: sans-serif; font-size: 13px; font-weight: 900; color: #090d16; text-decoration: none; padding: 16px 36px; display: inline-block; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                      JE M'INSCRIS GRATUITEMENT
                    </a>
                  </td>
                </tr>
              </table>
              <div style="color: #64748b; font-size: 11px; font-family: sans-serif; margin-top: 15px; font-style: italic;">
                * Entrée totalement libre mais réservation obligatoire pour le buffet de clôture.
              </div>
            </td>
          </tr>

          <!-- 5. L'ENTRETIEN EXCLUSIF (NICHOLAS GOODWIN INTERVIEW - FULL COPY WITH GUEST BLOCK) -->
          <tr>
            <td style="padding: 40px; background-color: #fcf9f8; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;" class="mobile-padding">
              <span style="font-family: monospace; color: #006685; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 4px;">
                // L'ENTRETIEN DÉCRYPTAGE / EXCLUSIF INÉDIT
              </span>
              <h2 style="color: #090d16; font-size: 24px; font-weight: 900; margin-top: 0; margin-bottom: 25px; font-family: sans-serif; letter-spacing: -0.5px;">
                L'Entretien Décryptage (Entretien Exclusif)
              </h2>
              
              <!-- INTERVIEW GUEST CARD -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin-bottom: 35px;">
                <tr>
                  <td style="padding: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Avatar image -->
                        <td width="64" valign="top" class="column" align="center" style="padding-bottom: 12px;">
                          <img src="${origin}/nicholas_goodwin.jpg?v=real_portrait" alt="Nicholas Goodwin" width="54" height="54" style="width: 54px; height: 54px; border-radius: 50%; border: 3px solid #006685; display: block; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.15);" referrerPolicy="no-referrer" />
                        </td>
                        
                        <!-- Guest Info -->
                        <td valign="top" class="column" style="padding-left: 20px;">
                          <h3 style="color: #090d16; font-size: 18px; font-weight: 850; margin: 0 0 4px 0; font-family: sans-serif;">
                            Nicholas Goodwin
                          </h3>
                          <p style="color: #006685; font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 1px; font-family: monospace;">
                            Ebilyse • Conseil, SI et Transformation Digitale
                          </p>
                          <p style="color: #475569; font-size: 13.5px; line-height: 1.5; margin: 0; font-family: sans-serif; font-style: italic;">
                            Administrateur de Silicon Comté et pilote de la commission de la nouvelle Newsletter pour faire rayonner notre croissance régionale et le génie d'édition assisté par l'IA.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- DIALOGUE (VERBATIM FROM MARKDOWN FILE) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom: 24px; border-bottom: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <p style="color: #006685; font-size: 14px; font-weight: bold; margin: 0 0 8px 0; font-family: sans-serif;">
                      Silicon Comté : Nicholas, pouvez-vous nous présenter Ebilyse et votre parcours ?
                    </p>
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.6; margin: 0; font-family: sans-serif;">
                      <strong style="color: #090d16;">Nicholas Goodwin :</strong> D'origine britannique, je bénéficie de plus de 40 années d'expérience dans des entreprises internationales, avec une spécialisation en informatique, marketing et communication. Avec Françoise Goodwin Hillier, experte en gestion d'entreprise et ressources humaines, nous avons créé Ebilyse. Notre mission est de proposer du conseil et un accompagnement sur mesure pour les artisans, TPE/PME et jeunes entreprises. Notre objectif est simple : leur faire gagner du temps pour qu'ils puissent se concentrer sur leur cœur de métier et augmenter leur rentabilité.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <p style="color: #006685; font-size: 14px; font-weight: bold; margin: 0 0 8px 0; font-family: sans-serif;">
                      Silicon Comté : Vous êtes membre de Silicon Comté depuis la création de l'association. Qu'est-ce qui vous a motivé à y adhérer dès le départ ?
                    </p>
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.6; margin: 0; font-family: sans-serif;">
                      <strong style="color: #090d16;">Nicholas Goodwin :</strong> La mise en relation d'affaires et le réseau sont au cœur de notre ADN, au même titre en relation de confiance et en prenant soin de nos partenaires de Besançon. Pour une entreprise comme la nôtre, qui accompagne les acteurs locaux dans leur numérisation, il était indispensable de faire partie d'un collectif qui fédère l'écosystème numérique. Rompre l'isolement des petites structures et partager des visions innovantes fait partie de nos priorités.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <p style="color: #006685; font-size: 14px; font-weight: bold; margin: 0 0 8px 0; font-family: sans-serif;">
                      Silicon Comté : Vous participez très régulièrement à nos différents événements. Que venez-vous y chercher en tant que chef d'entreprise ?
                    </p>
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.6; margin: 0; font-family: sans-serif;">
                      <strong style="color: #090d16;">Nicholas Goodwin :</strong> J’y trouve une formidable source d'idées et d'expérience. Ces rencontres permettent de puiser de l'inspiration non seulement auprès des autres membres, mais aussi des dynamiques du Grand Besançon et du monde technologique en général. C'est l'occasion d'échanger sur de nouvelles idées et de découvrir des outils qui peuvent transformer notre façon de travailler.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <p style="color: #006685; font-size: 14px; font-weight: bold; margin: 0 0 8px 0; font-family: sans-serif;">
                      Silicon Comté : Récemment, vous avez franchi un cap supplémentaire en rejoignant le Conseil d'Administration et en prenant la direction de la commission Newsletter. Qu'est-ce qui a motivé cet engagement plus profond ?
                    </p>
                    <p style="color: #334155; font-size: 14.5px; line-height: 1.6; margin: 0; font-family: sans-serif;">
                      <strong style="color: #090d16;">Nicholas Goodwin :</strong> Je souhaitais m'impliquer pour mettre en lumière les progrès, la croissance et l'enthousiasme grandissant au sein de notre association. En reprenant l'édition de cette newsletter mensuelle en français, mon ambition est de partager des informations utiles et intrigantes pour nos lecteurs. De plus, c'est l'occasion idéale d'utiliser concrètement l'IA comme un véritable "super-pouvoir" pour nos formats.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 6. HORIZONTAL AGENDA (LIGHT BLUE-GRAY SLATE ROADMAP CELL WITH FULL TEXT DESCRIPTIONS) -->
          <tr>
            <td style="padding: 40px; background-color: #f1f5f9; border-top: 1px solid #cbd5e1;" class="mobile-padding">
              <span style="font-family: monospace; color: #006685; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 4px;">
                // NOTRE PROGRAMMATION LOCALE EXCLUSIVE
              </span>
              <h2 style="color: #090d16; font-size: 22px; font-weight: 900; margin-top: 0; margin-bottom: 25px; font-family: sans-serif; letter-spacing: -0.5px;">
                Événements à ne pas manquer (Agenda des Rencontres)
              </h2>
              
              <!-- INTERACTIVE TABLE AGENDA (ALL 4 EVENTS EXACT DATES & COPY) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <!-- EVENT 1 (20 JUIN) -->
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="110" valign="top" style="background-color: #006685; color: #ffffff; border-radius: 6px; text-align: center; padding: 6px 10px; font-weight: bold; font-size: 10px; font-family: monospace; text-transform: uppercase;">
                          20 JUIN
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.5; color: #334155; font-family: sans-serif;">
                          <strong style="color: #0f172a;">Afterwork Networking (BFC Numérique) :</strong> Concept : Célébrons la cohésion dynamique de l'écosystème avec notre partenaire BFC Numérique pour clôturer le trimestre estival.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- EVENT 2 (26 JUIN) -->
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="110" valign="top" style="background-color: #fbd800; color: #090d16; border-radius: 6px; text-align: center; padding: 6px 10px; font-weight: bold; font-size: 10px; font-family: monospace; text-transform: uppercase;">
                          26 JUIN
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.5; color: #334155; font-family: sans-serif;">
                          <strong style="color: #0f172a;">Fête de l'Innovation 2026 :</strong> Lieu : Espace Grammont, Besançon. Grand rassemblement régional d'innovation, pitchs et networking.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- EVENT 3 (21 JUILLET) -->
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="110" valign="top" style="background-color: #0c111d; color: #ffffff; border-radius: 6px; text-align: center; padding: 6px 10px; font-weight: bold; font-size: 10px; font-family: monospace; text-transform: uppercase;">
                          21 JUILLET
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.5; color: #334155; font-family: sans-serif;">
                          <strong style="color: #0f172a;">Apéros IA (Au Ninkasi) :</strong> Format informel de 45 min à 1h pour échanger de manière collective autour des nouveautés IA de la région, tester des outils et partager des compilations de prompts.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- EVENT 4 (15 SEPTEMBRE) -->
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="110" valign="top" style="background-color: #10b981; color: #ffffff; border-radius: 6px; text-align: center; padding: 6px 10px; font-weight: bold; font-size: 10px; font-family: monospace; text-transform: uppercase;">
                          15 SEPTEMBRE
                        </td>
                        <td valign="top" style="padding-left: 15px; font-size: 14px; line-height: 1.5; color: #334155; font-family: sans-serif;">
                          <strong style="color: #0f172a;">Digital Apéro (IA Agentique & Éthique) :</strong> Lieu : Le Comptoir Général. Conférence de 30–45 minutes pour une trentaine de personnes, suivie d'un apéritif convivial.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>

          <!-- CALL TO ACTION: REJOIGNEZ L'IMPULSION -->
          <tr>
            <td style="padding: 45px 40px; background-color: #0c111d; border-top: 4px solid #fbd800; text-align: center;" class="mobile-padding">
              <span style="font-family: monospace; color: #fbd800; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">
                // REJOIGNEZ L'IMPULSION DE L'INNOVATION
              </span>
              <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-top: 0; margin-bottom: 15px; font-family: sans-serif; letter-spacing: -0.5px; line-height: 1.2;">
                Rejoignez l'impulsion de l'innovation
              </h2>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin-top: 0; margin-bottom: 25px; font-family: sans-serif; max-width: 500px; margin-left: auto; margin-right: auto;">
                Devenez acteur du dynamisme numérique en Franche-Comté ! Que vous soyez une entreprise, un indépendant, une startup ou un étudiant, adhérer à Silicon Comté vous permet de participer à nos rencontres, de figurer dans l'annuaire des compétences de la région et d'intégrer un réseau solidaire et innovant.
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td align="center" style="background-color: #fbd800; border-radius: 8px;">
                    <a href="https://www.siliconcomte.com" target="_blank" style="display: inline-block; padding: 14px 28px; color: #090d16; font-family: sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border-radius: 8px;">
                      S'inscrire / Renouveler l'adhésion
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- EMAIL FOOTER WITH VERSION AND COMPLIANCE (INTEGRATION LOGS) -->
          <tr>
            <td style="background-color: #090d16; padding: 40px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="color: #94a3b8; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0; font-family: monospace;">
                Silicon Comté • Édition N°3
              </p>
              <p style="color: #64748b; font-size: 11px; margin: 0 0 20px 0; line-height: 1.5; font-family: sans-serif;">
                © 2026 SILICON COMTÉ. TOUS DROITS RÉSERVÉS / ÉDITION CONSEIL EN CO-PROD.
              </p>
              
              <!-- Unique version label requested by Nicholas Goodwin to confirm real-time updates -->
              <span style="display: inline-block; font-family: monospace; font-size: 9px; color: #ffffff; background-color: #006685; border: 1px solid #005570; padding: 4px 12px; border-radius: 6px; font-weight: bold; letter-spacing: 0.5px;">
                ${referenceNumber}
              </span>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
  
  <!-- SECTION FOR FUTURE USE (HIDDEN FROM VIEW AND PRINT) -->
  <div id="for-future-use" class="no-print" style="display: none;">
    <!-- Paragraphe retiré de "Le Mot du Président" -->
    <div>
      <p>Par ailleurs, nous œuvrons activement à la simplification de notre écosystème grâce au projet de "co-adhésion" que nous lançons en partenariat avec La French Tech BFC et la Fabrique Numérique de Besançon. Notre objectif est de proposer un guichet unique, simple et fort pour tous les entrepreneurs locaux.</p>
    </div>

    <!-- Section "Alchimie Digitale N°2" -->
    <div>
      <h3>Alchimie Digitale N°2 : La Force du Collectif — La Révolution de la Co-Adhésion</h3>
      <p>L'union fait la force ! C’est pourquoi nous lançons le projet stratégique de "co-adhésion". Cette initiative vise à créer une passerelle unique et fluide entre trois piliers du territoire pour simplifier l'accès administratif et financier :</p>
      <ul>
        <li><strong>Silicon Comté</strong> : Rencontres de terrain, Digital Apéros, ateliers.</li>
        <li><strong>La French Tech BFC</strong> : Accès aux programmes nationaux (Next40/120, Tremplin), visibilité.</li>
        <li><strong>La Fabrique Numérique de Besançon</strong> : Formation professionnelle, inclusion numérique et pôle d'innovation.</li>
      </ul>
      <p>Une seule cotisation pour trois fois plus d'opportunités de networking et d'impact !</p>
    </div>

    <!-- Section "Repenser le Développement avec l'IA" -->
    <div>
      <h3>Repenser le Développement avec l'IA : Un nouveau "Super-Pouvoir"</h3>
      <h4>IA Agentique & Éthique : Apprenez à co-piloter vos projets avec l'IA</h4>
      <p>Adoptez l'adoption de l'IA pour automatiser vos tâches récurrentes tout en respectant une charte éthique stricte de souveraineté des données.</p>
      <p>Découvrez des cas d'usage réels, apprenez à formuler des requêtes complexes, et optimisez votre flux quotidien sans compromettre la sécurité.</p>
      <div>
        <strong>Prompt du mois :</strong>
        <p>"Générer des idées de partenariats croisés et de marketing d'entraide pour mon commerce local situé à Besançon."</p>
      </div>
      <div>
        <strong>Observatoire des compétences :</strong>
        <p>INTELLIGENCE ARTIFICIELLE : 42% de l'écosystème local</p>
        <p>DÉVELOPPEMENT WEB : 28% de l'écosystème local</p>
      </div>
    </div>
  </div>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Silicon_Comte_Newsletter_No3.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Animation helper to disable motion and force final visible state during PDF generation
  const anim = (initial: any, final: any, transition?: any, key: 'animate' | 'whileInView' = 'animate') => {
    if (isGenerating) {
      const completed: any = {};
      const keys = new Set([...Object.keys(initial), ...Object.keys(final)]);
      for (const k of keys) {
        if (k === 'opacity') {
          completed[k] = 1;
        } else if (k === 'x' || k === 'y' || k === 'z') {
          completed[k] = 0;
        } else if (k === 'scale') {
          completed[k] = 1;
        } else if (k === 'rotate' || k === 'rotateY' || k === 'rotateX') {
          completed[k] = 0; // Force flat non-transformed state for precise PDF rendering
        } else {
          completed[k] = final[k] !== undefined ? final[k] : initial[k];
        }
      }
      return {
        initial: completed,
        animate: completed,
        transition: { duration: 0 }
      };
    }
    return {
      initial,
      [key]: final,
      transition
    };
  };

  // Animation Presets
  const fadeInUp = isGenerating ? {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 },
    variants: {
      initial: { opacity: 1, y: 0 },
      whileInView: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 }
    },
    transition: { duration: 0 }
  } : {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    variants: {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 }
    },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = isGenerating ? {
    initial: {},
    animate: {},
    transition: { duration: 0 }
  } : {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.15
      }
    },
    viewport: { once: true, margin: "-50px" }
  };

  const cardHoverEffect = isGenerating ? "" : "hover:shadow-[0_22px_50px_rgba(0,102,133,0.08)] hover:border-highlighter hover:-translate-y-3 transition-all duration-500 ease-out";

  return (
    <div ref={newsletterRef} className="font-sans min-h-screen bg-[#fcf9f8] selection:bg-highlighter selection:text-black scroll-smooth">
      
      {/* 1. TOP NAVIGATION / LOGO BAR */}
      <nav className={`${isGenerating ? 'bg-white relative' : 'bg-white/80 backdrop-blur-md sticky top-0'} py-5 px-6 md:px-12 relative z-50 border-b border-slate-100 flex items-center justify-between shadow-sm`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4">
          <a href="#" className="flex items-center gap-3">
            <img 
              src="/logo-siliconcomte.png" 
              alt="Silicon Comté — Association du numérique et de l'innovation en Franche-Comté" 
              style={{ maxWidth: '210px' }} 
              className="w-full mix-blend-multiply hover:opacity-90 transition-opacity" 
            />
          </a>
          
          {/* Glass-morphic Metadata Bar */}
          <div className="h-9 flex items-center gap-5 bg-slate-900 border border-slate-800 text-white px-6 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-xs font-mono font-bold tracking-widest uppercase leading-none">
            <span className="text-highlighter flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-highlighter animate-pulse shrink-0"></span>
              EDITION N°3
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">JUIN 2026</span>
          </div>
        </div>
      </nav>

      {/* 2. HIGH-IMPACT MULTI-LAYERED HERO SECTION */}
      <header className="relative w-full overflow-hidden bg-slate-950 pt-24 pb-32 md:pt-36 md:pb-48 px-6 md:px-12 text-white border-b-8 border-highlighter">
        {/* Underlay Grid & Imagery with custom blend and darkness overlay */}
        <div className={`absolute inset-0 z-0 opacity-40 bg-[url('/illustration-home-new.png')] bg-cover bg-center bg-no-repeat ${isGenerating ? '' : 'mix-blend-luminosity'}`}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-900"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text columns */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <motion.div 
              {...anim({ opacity: 0, x: -30 }, { opacity: 1, x: 0 }, { duration: 0.8 })}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-1 bg-highlighter rounded-full"></div>
              <span className="text-highlighter font-mono font-extrabold tracking-widest uppercase text-xs md:text-sm">
                Newsletter Officielle
              </span>
            </motion.div>
            
            <motion.h1 
              {...anim({ opacity: 0, y: 30 }, { opacity: 1, y: 0 }, { duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] })}
              className="headline text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight uppercase"
            >
              SILICON COMTÉ<br />
              <span className={`${isGenerating ? 'text-highlighter' : 'text-transparent bg-clip-text bg-gradient-to-r from-highlighter via-yellow-400 to-amber-500'} font-extrabold`}>
                N°3 | L'ÉCOSYSTÈME
              </span>
            </motion.h1>

            <motion.p 
              {...anim({ opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { duration: 0.8, delay: 0.2 })}
              className="mt-8 text-xl md:text-2xl font-light text-slate-300 max-w-2xl font-display leading-relaxed"
            >
              Le Guide de l'Innovation Numérique en BFC.
            </motion.p>
          </div>

          {/* Floating Glass Box with refined entry & 'Peek' animation */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end relative">
            <motion.div 
              {...anim({ opacity: 0, scale: 0.8, rotate: -8, x: 40 }, { opacity: 1, scale: 1, rotate: 6, x: 0 }, { type: "spring", damping: 15, stiffness: 80, delay: 0.4 })}
              whileHover={isGenerating ? undefined : { rotate: 1, scale: 1.03, transition: { duration: 0.3 } }}
              className={`relative w-64 h-64 ${isGenerating ? 'bg-slate-900' : 'backdrop-blur-xl bg-slate-900/50'} border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center cursor-pointer origin-bottom-right`}
            >
              {/* Header Ribbon Glow */}
              <div className="w-full h-2.5 bg-gradient-to-r from-highlighter to-amber-500 absolute top-0 left-0 rounded-t-3xl"></div>
              
              {/* Inner content */}
              <span className="absolute top-4 left-5 font-mono text-[9px] text-[#fbd800]/50 tracking-widest">NUMÉRO CERTIFIÉ //</span>
              <Calendar size={44} className="text-highlighter mb-5 opacity-90 drop-shadow-[0_0_15px_rgba(251,216,0,0.4)]" />
              <p className="font-mono text-center text-slate-400 text-[10px] tracking-widest uppercase font-bold">Édition de</p>
              <p className="text-4xl font-extrabold font-display text-white mt-1 tracking-tight">Juin 2026</p>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-6 flex justify-center items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 rounded-full w-max border border-emerald-500/20 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                CONSEIL ACTIF
              </div>
            </motion.div>
          </div>

        </div>
      </header>

      {/* 3. SECTION 1: EDITORIAL (LE MOT DU PRÉSIDENT) */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white relative shadow-md z-10 -mt-16 rounded-t-4xl max-w-[95%] lg:max-w-[1340px] mx-auto border-t-8 border-highlighter">
        <div className="max-w-6xl mx-auto">
          
          <motion.div 
            {...fadeInUp}
            className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start"
          >
            {/* Left Column: President Bio Card with High Impact Visual */}
            <div className="w-full md:w-1/3 shrink-0 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-highlighter to-[#006685] rounded-full blur-xl opacity-20 group-hover:opacity-45 transition duration-500"></div>
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-slate-100 overflow-hidden shadow-xl border-4 border-white relative z-10">
                  <img 
                    src="/antoine_bouet.png" 
                    alt="Antoine Bouet — Président de Silicon Comté" 
                    className="w-full h-full object-cover scale-110" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="mt-6 text-center md:text-left z-10">
                <h3 className="font-display font-extrabold text-2xl text-slate-950 uppercase tracking-tight">Antoine Bouet</h3>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-widest font-bold mt-1 shadow-sm px-3 py-1 bg-slate-50 border border-slate-100 rounded-full inline-block">
                  Président, Silicon Comté
                </p>
              </div>

              {/* Publication details in French */}
              <div className="mt-8 border-t border-slate-100 pt-6 w-full text-slate-400 font-mono text-[10px] uppercase space-y-2 hidden md:block">
                <div className="flex justify-between"><span>Date d'édition&nbsp;:</span> <span className="font-semibold text-slate-600">10 Juin 2026</span></div>
                <div className="flex justify-between"><span>Validation&nbsp;:</span> <span className="font-semibold text-[#006685]">Validé par le Bureau</span></div>
                <div className="flex justify-between"><span>Référence&nbsp;:</span> <span className="font-semibold text-slate-600">SC-NL-2026-N3</span></div>
              </div>
            </div>

            {/* Right Column: Dynamic Editorial Content and Quotation */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="headline text-4xl md:text-5xl text-slate-950 !normal-case tracking-tight font-extrabold !leading-snug">
                  Le Mot du Président
                </h2>
                <span className="block w-16 h-1 bg-[#006685] mt-6"></span>
              </div>

              <div className="text-slate-700 leading-relaxed text-base md:text-lg space-y-6 font-light">
                <div className="relative pl-6 md:pl-10 border-l-4 border-highlighter mb-10 py-2">
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                    "Apprenons à nous connaître pour mieux nous valoriser&nbsp;!"
                  </p>
                </div>

                <p className="text-slate-600">
                  L'association Silicon Comté se redynamise avec une énergie nouvelle et une ambition forte. Notre priorité absolue est claire : fédérer l'ensemble de l'écosystème numérique local de Franche-Comté en remettant l'événementiel, le partage d'expertise et l'innovation au cœur de nos actions. La richesse de nos récents rendez-vous a créé un véritable élan, et c'est en nous réunissant que nous continuerons de créer de la valeur pour notre territoire.
                </p>
                <p className="text-slate-600">
                  Cette année, notre engagement s'accélère. Nous faisons de l'adoption de l'Intelligence Artificielle un axe majeur de notre développement, la considérant comme un véritable "super-pouvoir" pour nos membres. Cette volonté se traduit par nos rencontres mensuelles "Apéros IA" au Ninkasi, ainsi que par la refonte de notre annuaire des compétences. Désormais automatisé par l'IA, cet outil a vocation à devenir un véritable observatoire du numérique local.
                </p>
                <p className="text-slate-600">
                  En rejoignant Silicon Comté, nos membres bénéficient d'une multitude d'avantages exclusifs conçus pour accélérer leur croissance. De la mise en valeur prioritaire de vos expertises au sein de notre nouvel annuaire à l'opportunité d'animer nos célèbres Digital Apéros, nous créons des espaces uniques d'échange. Ce réseau dynamique favorise les synergies d'affaires, le partage de bonnes pratiques sur les technologies de pointe, et multiplie les opportunités de networking de haut niveau pour propulser ensemble la visibilité de nos talents régionaux.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. SECTION 2: ACTUALITÉS DU CONSEIL D'ADMINISTRATION with 'High-Tech Archivist' cards */}
      <section className="py-24 md:py-32 bg-slate-50 relative border-y border-slate-200/60 overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <motion.div {...fadeInUp}>
              <p className="font-mono text-[#006685] font-extrabold tracking-widest uppercase mb-3 text-xs md:text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006685] shrink-0"></span>
                Actualités de l'écosystème
              </p>
              <h2 className="headline text-4xl md:text-5xl !normal-case text-slate-950 font-extrabold tracking-tight">
                Actualités du Conseil d'administration
              </h2>
            </motion.div>

            <motion.div 
              {...anim({ rotate: -12, scale: 0.8 }, { rotate: 12, scale: 1 }, undefined, 'whileInView')}
              viewport={{ once: true }}
              className="hidden md:flex w-24 h-24 bg-white rounded-[2rem] items-center justify-center shadow-lg border border-slate-100"
            >
              <Megaphone className="text-[#006685] w-9 h-9" />
            </motion.div>
          </div>
          
          {/* stacked Horizontal Rows - Elongated sections to prevent blank space, shorter section first */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col gap-10 max-w-5xl mx-auto"
          >
            {/* Card 3: Communication (Shorter, rendered first) */}
            <motion.div 
              variants={fadeInUp}
              className={`bg-slate-900 rounded-[2rem] border-t-8 md:border-t-0 md:border-l-8 border-highlighter p-8 md:p-10 border border-slate-800 shadow-sm text-white flex flex-col md:flex-row gap-8 justify-between hover:shadow-[0_22px_50px_rgba(251,216,0,0.1)] hover:border-highlighter transition-all duration-500 ease-out group`}
            >
              <div className="md:w-1/3 flex flex-col">
                {/* 48x48px SVG Icon container */}
                <div className="w-16 h-16 bg-highlighter/10 rounded-2xl flex items-center justify-center mb-8 border border-highlighter/20 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Megaphone color="#fbd800" strokeWidth={1.8} size={48} className="w-12 h-12" />
                </div>

                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-bold">RELAIS INFO // VOL. 03</div>

                <h3 className="text-2xl font-display font-extrabold text-white leading-snug">
                  Nouvelle Dynamique de Communication : Des outils repensés pour vous connecter
                </h3>
              </div>
              
              <div className="md:w-2/3 flex flex-col justify-between">
                <div className="text-slate-300 font-light text-[15px] leading-relaxed space-y-4 mb-8">
                  <p>
                    Afin de fluidifier nos échanges, nous concentrons nos efforts là où notre écosystème est le plus actif : notre page LinkedIn officielle pour la visibilité externe.
                  </p>
                  <p>
                    En parallèle, préparez-vous pour le lancement officiel de notre nouveau Blog destiné à relayer la richesse des témoignages et expertises de haut vol de nos membres.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-850 flex items-center justify-between text-xs text-highlighter font-mono font-bold">
                  <span>PAGE LINKEDIN OFFICIELLE</span>
                  <Check className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Card 1: Annuaire (Longer, rendered second) */}
            <motion.div 
              variants={fadeInUp}
              className={`bg-white rounded-[2rem] border-t-8 md:border-t-0 md:border-l-8 border-[#006685] p-8 md:p-10 border border-slate-200/50 shadow-sm flex flex-col md:flex-row gap-8 justify-between hover:shadow-[0_22px_50px_rgba(0,102,133,0.06)] hover:border-[#006685] transition-all duration-500 ease-out group`}
            >
              <div className="md:w-1/3 flex flex-col">
                {/* 48x48px SVG Icon container */}
                <div className="w-16 h-16 bg-[#006685]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#006685]/20 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Database color="#006685" strokeWidth={1.8} size={48} className="w-12 h-12" />
                </div>

                <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-bold">PROJET MAJEUR // VOL. 01</div>
                
                <h3 className="text-2xl font-display font-extrabold text-slate-950 leading-snug">
                  Annuaire des Compétences : Le nouveau cœur battant de notre écosystème
                </h3>
              </div>
              
              <div className="md:w-2/3 flex flex-col justify-between">
                <div className="text-slate-600 font-light text-[15px] leading-relaxed space-y-4 mb-8">
                  <p>
                    Identifié comme <span className="font-semibold text-slate-800">l'outil prioritaire pour fédérer notre communauté</span>, notre Annuaire des Compétences fait peau neuve pour devenir un véritable observatoire du numérique local. Ouvert à tous les acteurs du numérique de la région — qu'il s'agisse d'entreprises, d'indépendants ou d'étudiants —, ce projet incarne parfaitement le moteur de nos actions&nbsp;: "se connaître pour se faire connaître".
                  </p>
                  <p>
                    Pour garantir une plateforme moderne, <span className="font-semibold text-slate-800">sa création et sa gestion sont désormais automatisées</span>. Afin d'offrir une clarté maximale et d'aller droit à l'essentiel, nous avons fait le choix qualitatif d'imposer une limite stricte de <span className="font-semibold text-slate-800">deux compétences phares par profil</span>. Fini les listes interminables, place à l'expertise ciblée&nbsp;!
                  </p>
                  <p>
                    De plus, la fiabilité des données est notre priorité&nbsp;: nous avons instauré une modération avec validation régulière, couplée à une <span className="font-semibold text-slate-800">vérification API via le numéro SIRET</span> pour certifier un ancrage réel et sérieux en Franche-Comté.
                  </p>
                  <p>
                    Au-delà d'un simple répertoire, cet annuaire est une mine d'or pour comprendre notre territoire. Il nous permettra de faire du <em className="italic font-normal text-slate-800">data storytelling</em>, en transformant les données collectées en infographies visuelles pour illustrer les grandes tendances.
                  </p>
                  <p>
                    Enfin, bien que l'outil soit ouvert aux non-adhérents, <span className="font-semibold text-slate-800">nos membres bénéficient d'avantages exclusifs</span>&nbsp;: l'ajout d'un "badge adhérent" sur leur profil et, surtout, l'intégration d'un <em className="italic font-normal text-[#006685]">backlink</em> pointant vers leur site, un atout précieux pour booster leur propre référencement en ligne.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-[#006685] font-mono font-bold">
                  <span>VÉRIFIÉ SIRET API</span>
                  <Check className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* 5. SECTION 3: REPENSER LE DÉVELOPPEMENT & L'ART DE L'IA (RESERVÉ POUR FUTURES ÉDITIONS - TOGGLEABLE ACCORDING TO USER STATE) */}
      <div id="section-future-archive" style={{ display: showFutureMaterial ? 'block' : 'none' }} className="no-print">
      <section className="py-24 md:py-32 px-6 md:px-12 bg-slate-950 text-white relative overflow-hidden border-b-4 border-slate-900">
        {!isGenerating && (
          <>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-highlighter/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#006685]/10 rounded-full blur-[100px] pointer-events-none"></div>
          </>
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div {...fadeInUp} className="mb-16">
            <span className="font-mono text-highlighter text-xs uppercase tracking-widest font-extrabold bg-highlighter/10 px-4 py-1.5 rounded-full border border-highlighter/20 inline-block mb-4">
              Intelligence Artificielle & Productivité
            </span>
            <h2 className="headline text-4xl md:text-5xl lg:text-6xl font-black max-w-4xl tracking-tight leading-[1.1] uppercase">
              Repenser le développement avec l'IA&nbsp;:<br />
              <span className={`${isGenerating ? 'text-highlighter' : 'text-transparent bg-clip-text bg-gradient-to-r from-highlighter to-yellow-400'}`}>
                Un nouveau "Super-Pouvoir"
              </span>
            </h2>
          </motion.div>
          
          {/* Dynamic Grid representing high visual impact and mockups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            
            {/* Prompt of the Month - Bento box (cols-8) */}
            <motion.div 
              {...fadeInUp}
              className={`${isGenerating ? 'bg-slate-900' : 'bg-slate-900/40 backdrop-blur-md'} border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 lg:col-span-8 shadow-2xl relative overflow-hidden flex flex-col justify-between group`}
            >
              {/* Header inside Prompt box */}
              <div className="relative z-10 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#fbd800] font-bold bg-[#fbd800]/10 px-3 py-1.5 rounded-full border border-[#fbd800]/20">
                    Prompt recommandé du mois
                  </span>
                  <Brain size={24} className="text-highlighter animate-pulse" />
                </div>
                <h3 className="text-2xl font-display font-extrabold text-white leading-tight">
                  Apprenez à co-piloter vos idées locales avec l'IA
                </h3>
                <p className="text-slate-400 font-light mt-2 text-sm">
                  Copiez et adaptez ce prompt de précision pour lancer des initiatives marketing de terrain.
                </p>
              </div>

              {/* Real Chat Experience Visual Layout */}
              <div className="space-y-4 relative z-10 my-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                     U
                  </div>
                  <div className="bg-slate-900 text-slate-200 px-4.5 py-3 rounded-2xl rounded-tl-none text-xs md:text-sm font-sans flex-1 leading-relaxed border border-slate-800">
                    “ Générer des idées de partenariats croisés et de marketing d'entraide pour mon commerce local situé à Besançon. ”
                  </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-highlighter shrink-0 flex items-center justify-center font-mono text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(251,216,0,0.4)]">
                     IA
                  </div>
                  <div className="bg-highlighter text-slate-950 px-4.5 py-3.5 rounded-2xl rounded-tr-none text-xs md:text-sm font-medium flex-1 leading-relaxed shadow-lg">
                    <strong>Suggestion:</strong> Proposez un coupon partagé avec la boulangerie voisine et organisez un "after-shopping" thématique au Pixel pour croiser vos communautés franc-comtoises.
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-2 mt-4 text-[11px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbd800] shrink-0"></span>
                Testé par notre commission innovation & validé en Cafés IA.
              </div>

              {/* Watermark brand print behind */}
              <div className="absolute top-1/2 left-2/3 -translate-x-12 -translate-y-12 z-0 opacity-[0.02] pointer-events-none">
                 <Brain size={420} className="text-white" />
              </div>
            </motion.div>

            {/* Audio summary Player - Bento box (cols-4) */}
            <motion.div 
              {...fadeInUp}
              className={`${isGenerating ? 'bg-slate-900' : 'bg-slate-900/40 backdrop-blur-md'} border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 lg:col-span-4 flex flex-col justify-between shadow-xl relative overflow-hidden group`}
            >
              <div>
                <div className="flex justify-between items-start mb-10">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold bg-slate-850 px-3 py-1.5 rounded-full border border-slate-800">
                    Synthèse de l'édition
                  </span>
                  <Mic className="text-[#006685] w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-3xl font-display font-black leading-tight text-white mb-3">
                  Résumé Audio IA
                </h3>
                <p className="text-slate-400 font-light text-sm leading-relaxed">
                  Pas le temps de tout lire&nbsp;? Lancez le résumé de 3 minutes généré automatiquement par synthèse neuronale. Un condensé d'intelligence locale.
                </p>
              </div>

              {/* Interactive Player Mockup */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 mt-8">
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 bg-highlighter text-slate-950 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_4px_16px_rgba(251,216,0,0.3)]">
                    <Play size={20} className="ml-1 fill-slate-950 text-slate-950" />
                  </button>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                      <span>PODCAST IA // EN COURS</span>
                      <span>02:45</span>
                    </div>
                    {/* Simulated Waveform with multiple lines */}
                    <div className="flex items-end gap-1 h-6">
                      <span className="w-1 h-[40%] bg-highlighter rounded-full animate-pulse"></span>
                      <span className="w-1 h-[70%] bg-highlighter/80 rounded-full animate-pulse delay-75"></span>
                      <span className="w-1 h-[100%] bg-highlighter rounded-full animate-pulse delay-150"></span>
                      <span className="w-1 h-[50%] bg-highlighter/60 rounded-full"></span>
                      <span className="w-1 h-[80%] bg-highlighter/90 rounded-full animate-pulse"></span>
                      <span className="w-1 h-[30%] bg-slate-700 rounded-full"></span>
                      <span className="w-1 h-[60%] bg-slate-700 rounded-full"></span>
                      <span className="w-1 h-[20%] bg-slate-800 rounded-full"></span>
                      <span className="w-1 h-[10%] bg-slate-800 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Data Storytelling Bento Box - Full width in cols (cols-12) */}
            <motion.div 
              {...fadeInUp}
              className={`${isGenerating ? 'bg-slate-900' : 'bg-slate-900/40 backdrop-blur-md'} border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-xl relative overflow-hidden`}
            >
              <div className="lg:col-span-6">
                <div className="flex items-center gap-3 mb-6">
                  <LineChart className="text-highlighter w-6 h-6" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#fbd800] font-bold bg-[#fbd800]/10 px-3 py-1.5 rounded-full border border-[#fbd800]/20">
                    Outil d'Observation // Statistiques
                  </span>
                </div>
                <h3 className="text-3xl font-display font-extrabold text-white leading-tight mb-4">
                  Data Storytelling&nbsp;: Cartographie de l'Annuaire
                </h3>
                <p className="text-slate-300 font-light text-base leading-relaxed">
                  L'IA trie et regroupe automatiquement les deux compétences phares de chaque profil adhérent pour générer des observatoires d'expertise locale. Voici la répartition actuelle des compétences prioritaires saisies sur l'annuaire au second trimestre.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-md border border-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-highlighter shrink-0"></span>
                    INTELLIGENCE ARTIFICIELLE : 42%
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-md border border-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0"></span>
                    DÉVELOPPEMENT WEB : 28%
                  </span>
                </div>
              </div>

              {/* Visually impressive bar chart */}
              <div className="lg:col-span-6 bg-slate-950/40 p-6 md:p-8 rounded-[1.8rem] border border-slate-850 flex flex-col justify-end w-full">
                <div className="flex items-end justify-between gap-4 h-48 pt-4">
                  {/* Bar 1 */}
                  <div className="flex flex-col items-center gap-3 group w-full">
                    <div className="w-full bg-slate-800 hover:bg-slate-700 transition-all rounded-t-lg h-[65%] relative flex items-end justify-center">
                      <span className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-mono py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        28% Recrutés
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider text-center block">DEV WEB</span>
                  </div>

                  {/* Bar 2 - Highlighter Core */}
                  <div className="flex flex-col items-center gap-3 group w-full">
                    <div className="w-full bg-gradient-to-t from-highlighter to-yellow-400 rounded-t-lg h-[90%] relative shadow-[0_0_30px_rgba(251,216,0,0.25)] hover:scale-105 transition-all flex items-end justify-center">
                      <span className="absolute bottom-full mb-2 bg-[#fbd800] text-slate-950 text-[10px] font-mono font-black py-1 px-2.5 rounded shadow-lg">
                        MÉTIER IA (42%)
                      </span>
                    </div>
                    <span className="text-xs font-mono text-highlighter font-extrabold uppercase tracking-wider text-center block">IA / ML</span>
                  </div>

                  {/* Bar 3 */}
                  <div className="flex flex-col items-center gap-3 group w-full">
                    <div className="w-full bg-[#006685]/70 hover:bg-[#006685] transition-all rounded-t-lg h-[45%] relative flex items-end justify-center">
                      <span className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-mono py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        18% Designers
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider text-center block">DESIGN</span>
                  </div>

                  {/* Bar 4 */}
                  <div className="flex flex-col items-center gap-3 group w-full">
                    <div className="w-full bg-slate-700/60 hover:bg-slate-700 transition-all rounded-t-lg h-[30%] relative flex items-end justify-center">
                      <span className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-mono py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        12% Consultants
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider text-center block">MARKETING</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </section>
      </div>

      {/* 5.5 SECTION 4: FÊTE DE L'INNOVATION 2026 (IMMERSIVE EVENT BANNER & DETAILED AGENDA) */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-slate-950 text-white relative overflow-hidden border-b-4 border-slate-900">
        {!isGenerating && (
          <>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-highlighter/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#006685]/10 rounded-full blur-[100px] pointer-events-none"></div>
          </>
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div {...fadeInUp} className="mb-16">
            <span className="font-mono text-highlighter text-xs uppercase tracking-widest font-extrabold bg-highlighter/10 px-4 py-1.5 rounded-full border border-highlighter/20 inline-block mb-4">
              Grand Événement Territorial // Franche-Comté
            </span>
            <h2 className="headline text-4xl md:text-5xl lg:text-6xl font-black max-w-4xl tracking-tight leading-[1.1] uppercase">
              Fête de l'Innovation&nbsp;:<br />
              <span className={`${isGenerating ? 'text-highlighter' : 'text-transparent bg-clip-text bg-gradient-to-r from-highlighter to-cyan-400'}`}>
                Édition Officielle 2026
              </span>
            </h2>
          </motion.div>
          
          {/* Bento Grid representing event info and layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Immersive Event Ticket - Bento block (cols-7) */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="lg:col-span-7 bg-slate-900/40 rounded-[2rem] border border-slate-800 p-8 md:p-10 flex flex-col justify-between group overflow-hidden relative min-h-[480px] shadow-2xl"
            >
              {/* Background graphic */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                style={{ backgroundImage: 'url("/fete_innovation.jpg")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <span className="h-8 inline-flex items-center justify-center font-mono text-[#006685] text-xs uppercase tracking-widest font-extrabold bg-white px-4 rounded-full border border-slate-200 shadow-md">
                    <Ticket className="w-3.5 h-3.5 mr-2" /> TICKET OFFICIEL
                  </span>
                  <span className="h-8 inline-flex items-center justify-center font-mono text-highlighter text-xs uppercase tracking-widest font-extrabold bg-slate-950/80 px-4 rounded-full border border-slate-850 shadow-md">
                    26 JUIN 2026
                  </span>
                </div>

                <div className="space-y-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#006685] font-extrabold">INVITATION OFFICIELLE // BESANÇON</p>
                  
                  <h3 className="text-3xl md:text-4xl font-display font-black leading-tight text-white uppercase group-hover:text-highlighter transition-colors">
                    Fête de l'Innovation 2026
                  </h3>

                  <p className="text-slate-300 font-light text-[15px] leading-relaxed max-w-xl">
                    L'Association Silicon Comté et La Fabrique Numérique Besançon, l'AER BFC, le Village by CA, DECA BFC et La French Tech BFC, ont le plaisir de vous inviter à la Fête de l'Innovation 2026 ! Chaque année, cet événement met à l'honneur l'innovation, l'entrepreneuriat et le numérique sur notre territoire.
                  </p>
                </div>
              </div>

              {/* Bottom Details Bar */}
              <div className="relative z-10 pt-8 mt-8 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/60 flex items-center justify-center border border-slate-800">
                    <Calendar className="w-5 h-5 text-highlighter" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Date & Heures</span>
                    <span className="text-sm font-bold text-white">Vendredi 26 juin, de 13h à 18h</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/60 flex items-center justify-center border border-slate-800">
                    <MapPin className="w-5 h-5 text-[#006685]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Lieu de rencontre</span>
                    <span className="text-sm font-bold text-white">Espace Grammont, Besançon</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Event Program Timetable - Bento block (cols-5) */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="lg:col-span-5 bg-slate-900 rounded-[2rem] border border-slate-850 p-8 md:p-10 flex flex-col justify-between hover:shadow-[0_22px_50px_rgba(251,216,0,0.05)] hover:border-slate-800 transition-all duration-500 ease-out relative"
            >
              <div>
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-850">
                  <h3 className="text-xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-highlighter shrink-0 animate-pulse"></span>
                    Le Programme
                  </h3>
                  <span className="text-slate-500 text-xs font-mono font-bold uppercase py-1 px-2.5 bg-slate-950/60 rounded-md border border-slate-850">
                    // TIMETABLE
                  </span>
                </div>

                {/* Vertical Timeline */}
                <div className="space-y-6 relative pl-3 before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:bg-gradient-to-b before:from-highlighter before:via-[#006685] before:to-slate-800">
                  
                  {/* Step 1 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-highlighter border-2 border-slate-900 shadow-md"></div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-mono text-xs font-extrabold text-highlighter bg-highlighter/10 px-2 py-0.5 rounded">13h00</span>
                      <span className="text-xs text-slate-400 font-mono tracking-widest uppercase font-bold">// OUVERTURE</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Accueil des participants et discours d'ouverture</h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Annonce majeure et officielle de la labellisation French Tech Besançon.</p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#006685] border-2 border-slate-900 shadow-md"></div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-mono text-xs font-extrabold text-[#006685] bg-[#006685]/10 px-2 py-0.5 rounded">13h30</span>
                      <span className="text-xs text-slate-400 font-mono tracking-widest uppercase font-bold">// PITCHS</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Pitchs de start-up locales innovantes</h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Démonstrations express de solutions technologiques régionales.</p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#006685] border-2 border-slate-900 shadow-md"></div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-mono text-xs font-extrabold text-[#006685] bg-[#006685]/10 px-2 py-0.5 rounded">14h30</span>
                      <span className="text-xs text-slate-400 font-mono tracking-widest uppercase font-bold">// CONFÉRENCE</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Table ronde : Recherche et Synergies</h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5 font-sans">
                      « Recherche publique, entrepreneuriat et entreprises numériques : quelles synergies ? » animée par <strong className="font-bold text-[#006685]">Sylvain Compagnon</strong> (DECA BFC).
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-900 shadow-md"></div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-mono text-xs font-extrabold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">15h30</span>
                      <span className="text-xs text-slate-400 font-mono tracking-widest uppercase font-bold">// PARTENAIRES</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Pitchs de nos structures partenaires</h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Présentation des dispositifs de soutien, de financement et de formation.</p>
                  </div>

                  {/* Step 5 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-md"></div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">16h30</span>
                      <span className="text-xs text-slate-400 font-mono tracking-widest uppercase font-bold">// CLÔTURE</span>
                    </div>
                    <h4 className="text-sm font-bold text-emerald-400">Buffet convivial, networking & RDV BtoB</h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Rencontres ciblées pour initier des collaborations concrètes.</p>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Bottom Panel with Description & Inscription Call-To-Action (cols-12) */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="lg:col-span-12 bg-slate-900/60 rounded-[2rem] border border-slate-850 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg hover:border-slate-800 transition-all duration-500"
            >
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap gap-2.5 items-center">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950/60 px-3 py-1 rounded-md border border-slate-850 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-highlighter shrink-0 animate-pulse"></span>
                    CO-ORGANISÉ PAR SILICON COMTÉ
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950/60 px-3 py-1 rounded-md border border-slate-850">
                    SANS FRAIS (INSCRIPTION REQUISE)
                  </span>
                </div>
                <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">
                  Unissons nos énergies pour booster notre écosystème
                </h4>
                <p className="text-slate-400 font-light text-sm leading-relaxed">
                  Cet événement réunit l'Association Silicon Comté, La Fabrique Numérique Besançon, l'AER BFC, le Village by CA, DECA BFC et La French Tech BFC pour un temps fort d'intelligence collective, soutenu activement par <strong className="font-bold text-white">Grand Besançon Métropole</strong> et la <strong className="font-bold text-white">Région Bourgogne-Franche-Comté</strong>.
                </p>
                <div className="flex items-center gap-2.5 text-xs text-highlighter font-mono font-bold pt-1">
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>NOTE : Pensez à imprimer votre badge nominatif généré par la plateforme avant l'événement !</span>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <a 
                  href="https://fete-innovation.make-an-event.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center font-display font-extrabold uppercase tracking-widest text-[#006685] hover:text-white bg-highlighter hover:bg-[#006685] px-10 py-5 rounded-2xl shadow-[0_10px_30px_rgba(251,216,0,0.3)] transition-all duration-300 text-sm group"
                >
                  JE M'INSCRIS ICI
                  <ArrowUpRight className="w-5 h-5 ml-2 group-hover:scale-125 transition-transform" />
                </a>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 6. SECTION 5: VALORISER L'ADHÉSION (MEMBERSHIP AND PHYSICAL BADGE DECK) */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Text description with custom number layouts */}
          <div className="lg:col-span-7">
            <motion.div {...fadeInUp}>
              <p className="font-mono text-slate-400 text-xs tracking-widest font-extrabold uppercase mb-4">
                // CRÉATEURS DE VALEUR / ADHÉREZ N°3
              </p>
              <h2 className="headline text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 mb-3 tracking-tight uppercase leading-none">
                Pourquoi nous joindre&nbsp;?<br />
                <span className={`${isGenerating ? 'text-[#006685]' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#006685] to-cyan-600'} font-extrabold`}>
                  Valoriser l'Adhésion
                </span>
              </h2>
              <p className="text-lg md:text-xl font-light text-slate-550 mb-12 max-w-xl">
                Bénéficiez immédiatement de retombées directes sur votre visibilité, votre réputation et votre croissance régionale.
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {[ 
                { num: '01', title: 'Badge Adhérent exclusif', desc: 'Sceau numérique officiel de labellisation à intégrer sur votre site et vos communications pour affirmer votre ancrage.' },
                { num: '02', title: 'Référencement (backlinks) dans l\'annuaire', desc: 'Boostez votre SEO technique grâce à un lien web certifié provenant du site officiel Silicon Comté, indexé pour rassurer vos prospects.' },
                { num: '03', title: 'Accueillir un Digital Apéro', desc: 'Une occasion unique de recevoir l\'ensemble de l\'écosystème numérique réunissant plus de 40 décideurs dans vos propres locaux.' },
                { num: '04', title: 'Pot de Rentrée réservé', desc: 'Accès exclusif et privé à nos grands rassemblements informels de networking de début de saison pour nouer des liens solides.' },
                { num: '05', title: 'Interview & Visibilité Exclusive', desc: 'Mettez en avant votre expertise, votre parcours et votre entreprise grâce à un entretien dédié, à l\'image de celui ci-après, publié dans de futures newsletters.' }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInUp} 
                  className="flex gap-6 items-start group relative"
                >
                  <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center font-display text-lg font-black bg-highlighter text-slate-950 group-hover:scale-110 group-hover:bg-[#006685] group-hover:text-white transition-all duration-300 shadow-[0_6px_20px_rgba(251,216,0,0.35)]">
                    {item.num}
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold font-sans text-slate-950 mb-1 group-hover:text-[#006685] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 font-light text-[15px] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Right Side: Virtual Holo Badge with 3D feel & interactive reflection */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full perspective-2000">
             <motion.div 
               {...anim({ opacity: 0, rotateY: 30, z: -100 }, { opacity: 1, rotateY: 10, z: 0 }, { duration: 1, ease: [0.16, 1, 0.3, 1] }, 'whileInView')}
               viewport={{ once: true }}
               whileHover={isGenerating ? undefined : { rotateY: -3, rotateX: 5, scale: 1.02 }}
               className="relative w-full max-w-[390px] aspect-[1/1.3] bg-white rounded-[2.5rem] shadow-[0_40px_90px_rgba(10,30,50,0.15)] border border-slate-100 flex flex-col overflow-hidden transform cursor-pointer transition-all duration-700"
             >
                {/* Lanyard Clip Hole */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-150 rounded-b-2xl shadow-inner z-20 flex justify-center items-center ${isGenerating ? '' : 'backdrop-blur-md'} border border-slate-200 border-t-0`}>
                  <div className="w-12 h-2.5 rounded-full bg-slate-300 shadow-inner"></div>
                </div>
                
                {/* Gradient Holo Top Ribbon */}
                <div className="h-28 w-full bg-gradient-to-r from-highlighter via-yellow-400 to-[#e5c500] shrink-0 z-10 flex items-center justify-center pt-5 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('/illustration-home-new.png')] bg-cover mix-blend-overlay"></div>
                  <span className={`h-8 inline-flex items-center justify-center font-display font-extrabold uppercase tracking-widest text-[#006685] text-[11px] relative z-10 ${isGenerating ? 'bg-white' : 'bg-white/40 backdrop-blur-md'} px-5 rounded-full border border-white/40 leading-none`}>
                    Sceau Adhérent 2026/2027
                  </span>
                </div>
                
                {/* Badge Main Body */}
                <div className="flex-1 p-8 text-center flex flex-col justify-between relative bg-gradient-to-b from-white to-slate-50/50">
                   {/* Logo vector embedded subtle */}
                   <div className="absolute inset-x-8 inset-y-16 opacity-[0.035] bg-[url('/logo-siliconcomte.png')] bg-center bg-no-repeat bg-contain pointer-events-none"></div>
                   
                   <div className="pt-4">
                     <h3 className="text-3xl font-display font-black text-slate-950 tracking-tight leading-none uppercase">
                       SILICON COMTÉ
                     </h3>
                     <p className="font-mono text-[9px] text-[#006685] tracking-widest uppercase mt-2 font-bold">
                       MEMBRE ACTIF CONNECTÉ BFC
                     </p>
                     
                     <div className="w-16 h-1.5 bg-[#006685] mx-auto mt-6 rounded-full shadow-[0_2px_10px_rgba(0,102,133,0.2)]"></div>
                   </div>
                   
                   {/* Barcode / Certification zone */}
                   <div className="bg-slate-900 text-white rounded-2xl p-4.5 border border-slate-800 shadow-md text-center max-w-[280px] mx-auto">
                     <p className="font-mono text-slate-500 text-[8px] uppercase tracking-widest mb-1.5">
                       Identifiant National Unique
                     </p>
                     <p className="font-mono font-bold text-highlighter text-sm tracking-widest">
                       #SC-2026-BFC-759X
                     </p>
                   </div>
                   
                   {/* Status zone footer inside ID badge */}
                   <div className="flex justify-between items-center mt-4">
                     <div className="h-7 inline-flex flex-col justify-center font-mono text-[9px] uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-3 rounded-full border border-emerald-100 shadow-sm leading-none">
                       <span className="flex items-center gap-1.5">
                         <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                         VÉLOX STATUS: ACTIVE
                       </span>
                     </div>
                     <img 
                       src="/logo-siliconcomte.png" 
                       alt="Certification" 
                       className="w-[70px] opacity-25 filter grayscale contrast-125" 
                     />
                   </div>
                </div>
             </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 5.5: MICRO-INTERVIEW WITH NICHOLAS GOODWIN (CO-FONDATEUR & DIRECTEUR NEWSLETTER) */}
      <section className="py-24 md:py-32 bg-white relative z-10 border-b border-slate-200/60 overflow-hidden">
        {/* Decorative Grid or Abstract Background Accents */}
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
        {!isGenerating && <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#006685]/5 rounded-full blur-[100px] pointer-events-none"></div>}

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Premium Speaker Profile Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div {...fadeInUp} className="w-full">
                
                {/* Visual Section Badge */}
                <span className="h-8 inline-flex items-center justify-center font-mono text-highlighter text-xs uppercase tracking-widest font-extrabold bg-slate-900 px-4.5 rounded-full border border-slate-800 shadow-md mb-6 leading-none">
                  // ENTRETIEN EXCLUSIF
                </span>
                
                <h2 className="headline text-4xl md:text-5xl text-slate-950 font-black tracking-tight uppercase mb-8 leading-none">
                  L'entretien<br />
                  <span className={`${isGenerating ? 'text-[#006685]' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#006685] to-cyan-600'} font-extrabold`}>
                    Décryptage
                  </span>
                </h2>

                {/* Profile Widget Card */}
                <div className="bg-slate-50/40 border border-slate-200/60 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                  <div className="relative group mb-6">
                    {!isGenerating && <div className="absolute -inset-1.5 bg-gradient-to-r from-highlighter to-[#006685] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>}
                    
                    {/* Stylish Avatar Image Block */}
                    <img 
                      src="/nicholas_goodwin.jpg?v=real_portrait" 
                      alt="Nicholas Goodwin" 
                      className="w-24 h-24 rounded-full object-cover shadow-md relative z-10 border-4 border-white select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h3 className="font-display font-black text-2xl text-slate-950 uppercase tracking-tight">Nicholas Goodwin</h3>
                  
                  <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                    <span className="h-6 inline-flex items-center justify-center text-slate-500 font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 bg-white border border-slate-200/50 rounded-full shadow-sm leading-none">
                      Moteur du CA
                    </span>
                    <span className="h-6 inline-flex items-center justify-center text-[#006685] font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 bg-white border border-slate-200/50 rounded-full shadow-sm leading-none">
                      Resp. Newsletter
                    </span>
                  </div>

                  <div className="mt-6 border-t border-slate-200/60 pt-6 w-full text-center lg:text-left">
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-2">Entité professionnelle</p>
                    <p className="font-display font-extrabold text-slate-900 text-lg uppercase tracking-tight">Ebilyse</p>
                    <p className="text-slate-500 text-sm font-light mt-1.5 leading-relaxed">
                      Conseil, transformation numérique et systèmes d'information pour artisans, TPE & PME.
                    </p>
                  </div>

                  {/* Quoted highlight block */}
                  <div className="mt-8 bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 relative z-10 w-full text-left">
                    <span className="absolute -top-3 left-4 text-4xl font-display font-black text-highlighter leading-none">“</span>
                    <p className="font-sans font-medium text-slate-200 text-xs leading-relaxed italic pt-1 text-center lg:text-left">
                      L'IA est un véritable "super-pouvoir" pour trouver des idées de formats originaux et alternatifs.
                    </p>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* Right Column: Q&A Thread Container */}
            <div className="lg:col-span-8 flex flex-col gap-10 md:gap-14">
              
              {/* Question & Answer Pack 1 */}
              <motion.div {...fadeInUp} className="flex flex-col gap-5 border-b border-slate-100 pb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#006685]/10 shrink-0 flex items-center justify-center border border-[#006685]/20 mt-1">
                    <MessageSquare size={18} className="text-[#006685]" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#006685] font-extrabold block mb-1">Silicon Comté :</span>
                    <h4 className="text-lg md:text-xl font-display font-extrabold text-slate-950 leading-snug">
                      Nicholas, pour commencer, pouvez-vous nous présenter Ebilyse et votre parcours ?
                    </h4>
                  </div>
                </div>
                
                <div className="lg:pl-14 text-slate-600 leading-relaxed text-base md:text-[17px] font-light space-y-3">
                  <p>
                    <strong className="font-bold text-slate-900">Nicholas Goodwin :</strong> D'origine britannique, je bénéficie de plus de <strong className="font-semibold text-slate-905">40 années d'expérience dans des entreprises internationales</strong>, avec une spécialisation en informatique, marketing et communication. Avec Françoise Goodwin Hillier, experte en gestion d'entreprise et ressources humaines, nous avons créé Ebilyse.
                  </p>
                  <p>
                    Notre mission est de proposer du conseil et un accompagnement sur mesure pour les artisans, TPE/PME et jeunes entreprises. Concrètement, nous les aidons dans leur transformation numérique, le développement de leurs systèmes d'information et la gestion administrative. L'objectif est simple : leur faire gagner du temps pour qu'ils puissent se concentrer sur leur cœur de métier et augmenter leur rentabilité.
                  </p>
                </div>
              </motion.div>

              {/* Question & Answer Pack 2 */}
              <motion.div {...fadeInUp} className="flex flex-col gap-5 border-b border-slate-100 pb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#006685]/10 shrink-0 flex items-center justify-center border border-[#006685]/20 mt-1">
                    <MessageSquare size={18} className="text-[#006685]" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#006685] font-extrabold block mb-1">Silicon Comté :</span>
                    <h4 className="text-lg md:text-xl font-display font-extrabold text-slate-950 leading-snug">
                      Vous êtes membre de Silicon Comté depuis la création de l'association. Qu'est-ce qui vous a motivé à y adhérer dès le départ ?
                    </h4>
                  </div>
                </div>
                
                <div className="lg:pl-14 text-slate-600 leading-relaxed text-base md:text-[17px] font-light">
                  <p>
                    <strong className="font-bold text-slate-900">Nicholas Goodwin :</strong> La mise en relation d'affaires et le réseau sont au cœur de notre ADN, comme en témoigne notre rôle de co-organisateurs de l'Apéro Entrepreneurs de Besançon. Pour une entreprise comme la nôtre, qui accompagne les acteurs locaux dans leur numérisation, il était indispensable de faire partie d'un collectif qui fédère l'écosystème numérique de Franche-Comté. Rompre l'isolement des petites structures et partager des visions innovantes fait partie de nos priorités.
                  </p>
                </div>
              </motion.div>

              {/* Question & Answer Pack 3 */}
              <motion.div {...fadeInUp} className="flex flex-col gap-5 border-b border-slate-100 pb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#006685]/10 shrink-0 flex items-center justify-center border border-[#006685]/20 mt-1">
                    <MessageSquare size={18} className="text-[#006685]" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#006685] font-extrabold block mb-1">Silicon Comté :</span>
                    <h4 className="text-lg md:text-xl font-display font-extrabold text-slate-950 leading-snug">
                      Vous participez très régulièrement à nos différents événements. Que venez-vous y chercher en tant que chef d'entreprise ?
                    </h4>
                  </div>
                </div>
                
                <div className="lg:pl-14 text-slate-600 leading-relaxed text-base md:text-[17px] font-light space-y-3">
                  <p>
                    <strong className="font-bold text-slate-900">Nicholas Goodwin :</strong> J'y trouve une formidable source de sagesse et d'expérience. Ces rencontres permettent de puiser de l'inspiration non seulement auprès des autres membres, mais aussi des dynamiques du département du Doubs et du monde technologique en général.
                  </p>
                  <p>
                    Par exemple, l'adoption de l'Intelligence Artificielle est devenue un thème majeur. Participer aux événements permet de rester connecté à ces innovations, d'échanger sur de nouvelles idées et de découvrir des outils qui peuvent transformer notre façon de travailler.
                  </p>
                </div>
              </motion.div>

              {/* Question & Answer Pack 4 */}
              <motion.div {...fadeInUp} className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-highlighter/10 shrink-0 flex items-center justify-center border border-highlighter/20 mt-1">
                    <Sparkles size={18} className="text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-600 font-extrabold block mb-1">Silicon Comté :</span>
                    <h4 className="text-lg md:text-xl font-display font-extrabold text-slate-950 leading-snug">
                      Récemment, vous avez franchi un cap supplémentaire en rejoignant le Conseil d'Administration et en prenant la direction de la commission Newsletter. Qu'est-ce qui a motivé cet engagement plus profond ?
                    </h4>
                  </div>
                </div>
                
                <div className="lg:pl-14 text-slate-600 leading-relaxed text-base md:text-[17px] font-light space-y-3">
                  <p>
                    <strong className="font-bold text-slate-900">Nicholas Goodwin :</strong> Je souhaitais m'impliquer pour mettre en lumière les progrès, la croissance et l'enthousiasme grandissant au sein de notre association. En reprenant l'édition de cette newsletter mensuelle en français, mon ambition est de partager des informations utiles et intrigantes pour nos lecteurs.
                  </p>
                  <p>
                    De plus, c'est l'occasion idéale d'utiliser concrètement l'IA comme un véritable <strong className="font-bold text-[#006685] bg-[#006685]/5 px-2 py-0.5 rounded border border-[#006685]/10">"super-pouvoir"</strong>. Je consulte régulièrement des outils comme Gemini pour trouver des idées de formats originaux et alternatifs.
                  </p>
                  <p className="font-medium text-slate-800 bg-[#fbd800]/5 border border-[#fbd800]/25 rounded-2xl p-5 md:p-6 mt-6">
                    Mon message de fond à travers cet engagement est clair : si vous êtes déjà adhérent, appréciez pleinement les opportunités que l'association vous offre ; et si ce n'est pas encore le cas, rejoignez-nous vite !
                  </p>
                </div>
              </motion.div>

            </div>

          </div>

        </div>
      </section>
      {/* 7. SECTION 6: AGENDA DES ÉVÉNEMENTS (HORIZONTAL TIMELINE) */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto bg-[#fcf9f8]">
        
        {/* Section Header */}
        <div className="mb-20 text-center md:text-left">
          <p className="font-mono text-[#006685] font-extrabold tracking-widest uppercase mb-3 text-xs md:text-sm flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006685] translate-y-[1px] shrink-0"></span>
            Agenda des rencontres
          </p>
          <h2 className="headline text-4xl md:text-5xl lg:text-6xl text-slate-950 font-black tracking-tight uppercase leading-none">
            Événements à ne pas manquer
          </h2>
        </div>

        <div className="relative mt-20">
           
           {/* Connecting Line - Positioned completely safe behind layout cards */}
           <div className="hidden lg:block absolute top-[4.5rem] left-[5%] right-[5%] h-[3px] bg-slate-200/80 z-0"></div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
             
             {/* Event 1 - Afterwork Networking */}
             <motion.div 
               {...fadeInUp}
               className="flex flex-col items-center lg:items-start text-center lg:text-left group relative"
             >
                {/* Mobile vertical line for visual flow */}
                <div className="absolute top-[5rem] bottom-[-4rem] left-[4.5rem] w-0.5 bg-slate-200 md:hidden z-0"></div>

                {/* Date bubble */}
                <div className="mb-6 flex flex-col items-center lg:items-start bg-[#fcf9f8] px-3 py-1 relative z-10 lg:pl-12 w-full">
                  <div className="h-16 flex items-end justify-center lg:justify-start w-full">
                    <span className="font-display text-7xl font-black text-slate-200 group-hover:text-highlighter transition-colors leading-none tracking-tighter mix-blend-multiply">
                      20
                    </span>
                  </div>
                  <span className="font-display font-extrabold text-slate-950 text-xl tracking-widest uppercase mt-3">
                    JUIN
                  </span>
                </div>

                {/* Absolute Node Circle */}
                <div className="hidden lg:block absolute top-[4.5rem] -translate-y-1/2 left-[1.25rem] w-6 h-6 rounded-full bg-white border-4 border-slate-300 group-hover:border-highlighter transition-colors shadow-md z-20"></div>
                
                {/* Description Card */}
                <div className={`w-full lg:ml-12 lg:w-[calc(100%-3rem)] mt-4 ${isGenerating ? 'bg-white' : 'backdrop-blur-md bg-white/70'} border border-slate-200/50 shadow-[0_10px_35px_rgba(0,0,0,0.03)] rounded-3xl p-6 hover:shadow-[0_15px_40px_rgba(0,102,133,0.06)] transition-all duration-300 flex-1 flex flex-col justify-between`}>
                  <div>
                    <span className="h-6 inline-flex items-center justify-center mb-4 text-[10px] font-mono font-bold tracking-widest uppercase bg-slate-900 text-white px-3.5 py-0 rounded-full shadow-sm border border-slate-850 leading-none">
                      BFC Numérique
                    </span>
                    <h3 className="text-lg font-display font-extrabold mb-3 text-slate-950 leading-snug uppercase">
                      AFTERWORK NETWORKING
                    </h3>
                    <p className="text-slate-650 font-light text-xs leading-relaxed">
                      <strong>Concept :</strong> Clôturons ce trimestre estival avec notre partenaire BFC Numérique autour d'un apéritif convivial pour fortifier la synergie réseau de nos membres.
                    </p>
                  </div>
                </div>
             </motion.div>

             {/* Event 2 - Fête de l'Innovation 2026 */}
             <motion.div 
               {...fadeInUp}
               className="flex flex-col items-center lg:items-start text-center lg:text-left group relative"
             >
                {/* Mobile vertical line for visual flow */}
                <div className="absolute top-[5rem] bottom-[-4rem] left-[4.5rem] w-0.5 bg-slate-200 md:hidden z-0"></div>

                {/* Date bubble */}
                <div className="mb-6 flex flex-col items-center lg:items-start bg-[#fcf9f8] px-3 py-1 relative z-10 lg:pl-12 w-full">
                  <div className="h-16 flex items-end justify-center lg:justify-start w-full">
                    <span className="font-display text-7xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors leading-none tracking-tighter mix-blend-multiply">
                      26
                    </span>
                  </div>
                  <span className="font-display font-extrabold text-slate-950 text-xl tracking-widest uppercase mt-3">
                    JUIN
                  </span>
                </div>

                {/* Absolute Node Circle */}
                <div className="hidden lg:block absolute top-[4.5rem] -translate-y-1/2 left-[1.25rem] w-6 h-6 rounded-full bg-white border-4 border-slate-300 group-hover:border-emerald-500 transition-colors shadow-md z-20"></div>
                
                {/* Description Card */}
                <div className={`w-full lg:ml-12 lg:w-[calc(100%-3rem)] mt-4 ${isGenerating ? 'bg-white' : 'backdrop-blur-md bg-white/70'} border border-slate-200/50 shadow-[0_10px_35px_rgba(0,0,0,0.03)] rounded-3xl p-6 hover:shadow-[0_15px_40px_rgba(0,102,133,0.06)] transition-all duration-300 flex-1 flex flex-col justify-between border-emerald-150`}>
                  <div>
                    <span className="h-6 inline-flex items-center justify-center mb-4 text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-500 text-white px-3.5 py-0 rounded-full shadow-sm leading-none">
                      BESANÇON
                    </span>
                    <h3 className="text-lg font-display font-extrabold mb-3 text-slate-950 leading-snug uppercase hover:text-emerald-500 transition-colors">
                      FÊTE DE L'INNOVATION
                    </h3>
                    <p className="text-slate-650 font-light text-xs leading-relaxed">
                      <strong>Lieu :</strong> Espace Grammont. Grand rendez-vous de l'innovation et du numérique en BFC. Table ronde, pitchs start-ups, buffet & réseautage d'affaires.
                    </p>
                  </div>
                </div>
             </motion.div>

             {/* Event 3 - Apéros IA */}
             <motion.div 
               {...fadeInUp}
               className="flex flex-col items-center lg:items-start text-center lg:text-left group relative"
             >
                {/* Mobile vertical line for visual flow */}
                <div className="absolute top-[5rem] bottom-[-4rem] left-[4.5rem] w-0.5 bg-slate-200 md:hidden z-0"></div>

                {/* Date bubble */}
                <div className="mb-6 flex flex-col items-center lg:items-start bg-[#fcf9f8] px-3 py-1 relative z-10 lg:pl-12 w-full">
                  <div className="h-16 flex items-end justify-center lg:justify-start w-full">
                    <span className="font-display text-7xl font-black text-slate-200 group-hover:text-[#006685] transition-colors leading-none tracking-tighter mix-blend-multiply">
                      21
                    </span>
                  </div>
                  <span className="font-display font-extrabold text-slate-950 text-xl tracking-widest uppercase mt-3">
                    JUILLET
                  </span>
                </div>

                {/* Absolute Node Circle */}
                <div className="hidden lg:block absolute top-[4.5rem] -translate-y-1/2 left-[1.25rem] w-6 h-6 rounded-full bg-white border-4 border-slate-300 group-hover:border-[#006685] transition-colors shadow-md z-20"></div>
                
                {/* Description Card */}
                <div className={`w-full lg:ml-12 lg:w-[calc(100%-3rem)] mt-4 ${isGenerating ? 'bg-white' : 'backdrop-blur-md bg-white/70'} border border-slate-200/50 shadow-[0_10px_35px_rgba(0,0,0,0.03)] rounded-3xl p-6 hover:shadow-[0_15px_40px_rgba(0,102,133,0.06)] transition-all duration-300 flex-1 flex flex-col justify-between`}>
                  <div>
                    <span className="h-6 inline-flex items-center justify-center mb-4 text-[10px] font-mono font-bold tracking-widest uppercase bg-[#006685] text-white px-3.5 py-0 rounded-full shadow-sm leading-none">
                      Au Ninkasi
                    </span>
                    <h3 className="text-lg font-display font-extrabold mb-3 text-slate-950 leading-snug uppercase">
                      APÉROS IA
                    </h3>
                    <p className="text-slate-650 font-light text-xs leading-relaxed">
                      <strong>Format :</strong> Format informel de 45 min à 1h pour échanger de manière collective autour des nouveautés IA de la région, tester des outils et partager des compilations de prompts.
                    </p>
                  </div>
                </div>
             </motion.div>

             {/* Event 4 - Digital Apéro (Moved to September) */}
             <motion.div 
               {...fadeInUp}
               className="flex flex-col items-center lg:items-start text-center lg:text-left group relative"
             >
                {/* Date bubble */}
                <div className="mb-6 flex flex-col items-center lg:items-start bg-[#fcf9f8] px-3 py-1 relative z-10 lg:pl-12 w-full">
                  <div className="h-16 flex items-end justify-center lg:justify-start w-full">
                    <span className="font-display text-7xl font-black text-slate-200 group-hover:text-highlighter transition-colors leading-none tracking-tighter mix-blend-multiply">
                      15
                    </span>
                  </div>
                  <span className="font-display font-extrabold text-slate-950 text-xl tracking-widest uppercase mt-3">
                    SEPTEMBRE
                  </span>
                </div>

                {/* Absolute Node Circle */}
                <div className="hidden lg:block absolute top-[4.5rem] -translate-y-1/2 left-[1.25rem] w-6 h-6 rounded-full bg-white border-4 border-slate-300 group-hover:border-highlighter transition-colors shadow-md z-20"></div>
                
                {/* Description Card */}
                <div className={`w-full lg:ml-12 lg:w-[calc(100%-3rem)] mt-4 ${isGenerating ? 'bg-white' : 'backdrop-blur-md bg-white/70'} border border-slate-200/50 shadow-[0_10px_35px_rgba(0,0,0,0.03)] rounded-3xl p-6 hover:shadow-[0_15px_40px_rgba(0,102,133,0.06)] transition-all duration-300 flex-1 flex flex-col justify-between`}>
                  <div>
                    <span className="h-6 inline-flex items-center justify-center mb-4 text-[10px] font-mono font-bold tracking-widest uppercase bg-highlighter text-slate-950 px-3.5 py-0 rounded-full border border-yellow-200/50 shadow-sm leading-none">
                      IA Agentique & Éthique
                    </span>
                    <h3 className="text-lg font-display font-extrabold mb-3 text-slate-950 leading-snug uppercase">
                      DIGITAL APÉRO
                    </h3>
                    <p className="text-slate-650 font-light text-xs leading-relaxed">
                      <strong>Lieu :</strong> Le Comptoir Général. Format : Conférence de 30–45 minutes pour une trentaine de décideurs, suivie d'un apéritif convivial d'échanges.
                    </p>
                  </div>
                </div>
             </motion.div>
             
           </div>
        </div>
      </section>

      {/* 8. FOOTER WITH REFIND OUTLINES AND BRAND INTEGRATIONS */}
      <footer className="bg-slate-950 pt-24 pb-16 px-6 md:px-12 relative overflow-hidden text-white border-t-[12px] border-highlighter">
        <div className="absolute inset-0 z-0 opacity-[0.035] bg-[url('/illustration-home-new.png')] bg-cover bg-center bg-no-repeat mix-blend-luminosity"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16">
          
          <div className="lg:w-1/2 flex flex-col items-start">
            <h2 className="headline text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.1] text-white font-extrabold tracking-tight">
              Rejoignez l'impulsion de l'innovation <span className="text-highlighter italic font-light drop-shadow-[0_0_10px_rgba(251,216,0,0.15)]">technologique régionale.</span>
            </h2>
            
            <a 
              href="https://www.siliconcomte.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-highlighter text-slate-950 px-8 py-4.5 rounded-xl font-bold font-display uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-3.5 hover:bg-yellow-400 hover:-translate-y-1.5 active:translate-y-0 hover:shadow-[0_20px_40px_rgba(251,216,0,0.35)] transition-all duration-300 w-full md:w-max group"
            >
              S'INSCRIRE / RENOUVELER L'ADHÉSION
              <ArrowRight strokeWidth={2.8} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="lg:w-1/2 w-full z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono text-xs">
               <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 uppercase tracking-widest mb-4 font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006685] shrink-0"></span>
                    Siège Social
                  </p>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    ASSOCIATION SILICON COMTÉ<br />
                    48 GRANDE RUE<br />
                    25000 BESANCON
                  </p>
               </div>
               
               <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 uppercase tracking-widest mb-4 font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-highlighter shrink-0"></span>
                    Réseaux & Plateformes
                  </p>
                  <ul className="space-y-3.5 text-slate-300 font-sans text-sm">
                    <li>
                      <a href="https://www.siliconcomte.com" target="_blank" rel="noopener noreferrer" className="hover:text-highlighter transition-colors flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-highlighter shrink-0"></span>
                        siliconcomte.com
                      </a>
                    </li>
                    <li>
                      <span className="text-slate-500 cursor-not-allowed flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0"></span>
                        @SiliconComte (X)
                      </span>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-highlighter transition-colors flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006685] shrink-0"></span>
                        Page Officielle LinkedIn
                      </a>
                    </li>
                  </ul>
               </div>
            </div>
          </div>

        </div>
        
        {/* Footer Technical Metadata Row */}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="w-full h-px bg-slate-800 my-16"></div>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">
            <p className="flex flex-wrap items-center gap-2">
              <span>© 2026 SILICON COMTÉ. TOUS DROITS RÉSERVÉS / ÉDITION CONSEIL EN CO-PROD.</span>
              <span className="text-[#006685] bg-[#006685]/10 px-2 py-0.5 rounded border border-[#006685]/20 font-mono">
                {referenceNumber}
              </span>
            </p>
            <div className="h-9 flex flex-wrap justify-center items-center gap-4 bg-slate-950 border border-slate-850 px-5 rounded-full shadow-inner leading-none">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></span> PROPULSÉ PAR ASSOCONNECT</span>
              <span className="text-slate-800">|</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></span> MAILING VIA BREVO</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. STANDALONE PDF EXPORT CONTROL STATION - EXCLUDED FROM ACTUAL PDF CANVAS */}
      <section 
        data-html2canvas-ignore="true" 
        className="bg-slate-900 border-t border-slate-800 py-16 px-6 md:px-12 relative z-30"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
            <span className="font-mono text-highlighter text-[10px] uppercase tracking-widest font-extrabold bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-md inline-block mb-4">
              // ARCHIVAGE OPTIMISÉ
            </span>
            <h3 className="text-2xl md:text-3xl text-white font-extrabold tracking-tight uppercase font-display leading-tight">
              Exporter la version numérique
            </h3>
            <p className="text-slate-400 font-light text-sm mt-3 leading-relaxed">
              Téléchargez cette édition au format PDF haute fidélité. Le document généré s'ajustera automatiquement à la largeur du layout sans aucune coupure de page, idéal pour une impression propre ou une lecture déconnectée.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 shrink-0 w-full md:w-auto">
            <button
              onClick={generateMarkdown}
              className="w-full lg:w-auto px-8 py-5 rounded-2xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:shadow-[0_15px_30px_rgba(251,216,0,0.05)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-highlighter" />
              TÉLÉCHARGER LE TEXTE (MD)
            </button>

            <button
              onClick={generateHtmlEmail}
              className="w-full lg:w-auto px-8 py-5 rounded-2xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:shadow-[0_15px_30px_rgba(251,216,0,0.05)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              <Mail className="w-5 h-5 text-highlighter" />
              EXPORTER EN HTML (EMAIL)
            </button>

            <button
              onClick={toggleFutureMaterial}
              className="w-full lg:w-auto px-8 py-5 rounded-2xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-highlighter/50 hover:shadow-[0_15px_30px_rgba(251,216,0,0.05)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              {showFutureMaterial ? (
                <>
                  <EyeOff className="w-5 h-5 text-highlighter" />
                  <span>MASQUER L'ARCHIVE (IA)</span>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 text-highlighter" />
                  <span>AFFICHER L'ARCHIVE (IA)</span>
                </>
              )}
            </button>

            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className={`w-full lg:w-auto px-8 py-5 rounded-2xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-3.5 shadow-lg border transition-all duration-300 ${
                isGenerating 
                  ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-highlighter border-highlighter text-slate-950 hover:bg-yellow-400 hover:shadow-[0_15px_30px_rgba(251,216,0,0.25)] hover:-translate-y-1 active:translate-y-0 cursor-pointer'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  GÉNÉRATION DU PDF EN COURS...
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5 text-slate-950" />
                  TÉLÉCHARGER LA NEWSLETTER (PDF)
                </>
              )}
            </button>
          </div>
          
        </div>
      </section>
    </div>
  );
}
