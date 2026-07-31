import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, LineChart, Sparkles, User, AudioLines, ArrowRight, CornerDownRight, 
  CheckCircle2, Database, Network, Megaphone, Brain, Cpu, MessageSquare, 
  Calendar, Mic, ArrowUpRight, Check, Award, Compass, HelpCircle, Terminal,
  FileDown, Loader2, FileText, MapPin, Ticket, Printer, Mail, Eye, EyeOff,
  Menu, X, Plus, Linkedin, Globe, Users, Search, Building2, ExternalLink, UserPlus
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  annuaireCleanNetwork,
  dgfipLogoImg,
  ninkasiLogoImg,
  antoineBouetImg,
  brunoRoyImg,
  nicholasGoodwinImg,
  logoSiliconComte,
  illustrationHome
} from './assets/imagesData';

interface Edition {
  id: number;
  editionNumber: number;
  date: string;
  dateUpper: string;
  fullDate: string;
  referenceNumber: string;
}

interface EditionContent {
  presidentTitle: string;
  presidentQuote: string;
  presidentParagraphs: string[];
  recapTitle?: string;
  recapParagraphs?: string[];
  agendaIntro: string;
  agendaEvents: { date: string; title: string; desc: string; link?: string }[];
  caNewsTitle: string;
  caNewsIntro: string;
  caNewsBullet1: string;
  caNewsBullet2: string;
  interviewTitle: string;
  interviewSubtitle: string;
  guestName: string;
  guestCompany: string;
  guestRoleTag: string;
  guestBio: string;
  guestQuote: string;
  guestImage: string;
  qas: { question: string; answer: string }[];
  membershipBullets: string[];
}

function getEditionContent(editionNumber: number): EditionContent {
  if (editionNumber === 1) {
    return {
      presidentTitle: "Le Mot du Président",
      presidentQuote: "Apprenons à nous connaître pour mieux nous valoriser !",
      presidentParagraphs: [
        "L'association Silicon Comté se redynamise avec une énergie nouvelle et une ambition forte. Notre priorité absolue est claire : fédérer l'ensemble de l'écosystème numérique local de Franche-Comté en remettant l'événementiel, le partage d'expertise et l'innovation au cœur de nos actions. La richesse de nos récents rendez-vous a créé un véritable élan, et c'est en nous réunissant que nous continuerons de créer de la valeur pour notre territoire.",
        "Cette année, notre engagement s'accélère. Nous faisons de l'adoption de l'Intelligence Artificielle un axe majeur de notre développement, la considérant comme un véritable \"super-pouvoir\" pour nos membres. Cette volonté se traduit par nos rencontres mensuelles \"Apéros IA\" au Ninkasi, ainsi que par la refonte de notre annuaire des compétences. Désormais automatisé par l'IA, cet outil a vocation à devenir un véritable observatoire du numérique local.",
        "En rejoignant Silicon Comté, nos membres bénéficient d'une multitude d'avantages exclusifs conçus pour accélérer leur croissance. De la mise en valeur prioritaire de vos expertises au sein de notre nouvel annuaire à l'opportunité d'animer nos célèbres Digital Apéros, nous créons des espaces uniques d'échange. Ce réseau dynamique favorise les synergies d'affaires, le partage de bonnes pratiques sur les technologies de pointe, et multiplie les opportunités de networking de haut niveau pour propulser ensemble la visibilité de nos talents régionaux."
      ],
      agendaIntro: "Découvrez notre sélection des temps forts de l'écosystème numérique en Franche-Comté :",
      agendaEvents: [
        { date: "20 JUIN 2026", title: "Afterwork Networking", desc: "Soirée de convivialité et d'échanges informels entre membres et passionnés." },
        { date: "26 JUIN 2026", title: "Fête de l'Innovation 2026", desc: "Grand rassemblement régional à l'Espace Grammont à Besançon." },
        { date: "21 JUILLET 2026", title: "Apéros IA #01", desc: "Rencontre thématique mensuelle au Ninkasi sur les opportunités de l'IA." },
        { date: "15 SEPTEMBRE 2026", title: "Digital Apéro", desc: "Rendez-vous de rentrée dans les locaux d'un membre adhérent." }
      ],
      caNewsTitle: "Projet Majeur N°1 : Annuaire des Compétences",
      caNewsIntro: "Identifié comme l'outil prioritaire pour fédérer notre communauté, notre Annuaire des Compétences fait peau neuve pour devenir un véritable observatoire du numérique local. Ouvert à tous les acteurs du numérique de la région (entreprises, indépendants ou étudiants), ce projet incarne notre devise : \"se connaître pour se faire connaître\".",
      caNewsBullet1: "Plateforme automatisée : Pour garantir une plateforme moderne, sa création et sa gestion sont désormais automatisées. Limite stricte de deux compétences phares par profil pour garantir une expertise ciblée.",
      caNewsBullet2: "Réseaux & Blog : Afin de fluidifier nos échanges, nous concentrons nos efforts sur notre page LinkedIn officielle et le lancement de notre nouveau Blog média.",
      interviewTitle: "L'entretien Décryptage",
      interviewSubtitle: "Chaque mois, un membre met en lumière ses expertises et sa vision de l'écosystème.",
      guestName: "Nicholas Goodwin",
      guestCompany: "Ebilyse",
      guestRoleTag: "Co-fondateur & Dir. Newsletter",
      guestBio: "Conseil, transformation numérique et systèmes d'information pour artisans, TPE & PME.",
      guestQuote: "L'IA est un véritable \"super-pouvoir\" pour trouver des idées de formats originaux et alternatifs.",
      guestImage: nicholasGoodwinImg,
      qas: [
        {
          question: "Nicholas, pour commencer, pouvez-vous nous présenter Ebilyse et votre parcours ?",
          answer: "D'origine britannique, je bénéficie de plus de 40 années d'expérience dans des entreprises internationales, avec une spécialisation en informatique, marketing et communication. Avec Françoise Goodwin Hillier, experte en gestion d'entreprise et ressources humaines, nous avons créé Ebilyse. Notre mission est de proposer du conseil et un accompagnement sur mesure pour les artisans, TPE/PME et jeunes entreprises. Notre objectif est simple : leur faire gagner du temps pour qu'ils puissent se concentrer sur leur cœur de métier et augmenter leur rentabilité."
        },
        {
          question: "Vous êtes membre de Silicon Comté depuis la création de l'association. Qu'est-ce qui vous a motivé à y adhérer dès le départ ?",
          answer: "La mise en relation d'affaires et le réseau sont au cœur de notre ADN, comme en témoigne notre rôle de co-organisateurs de l'Apéro Entrepreneurs de Besançon. Pour une entreprise comme la nôtre, qui accompagne les acteurs locaux dans leur numérisation, il était indispensable de faire partie d'un collectif qui fédère l'écosystème numérique. Rompre l'isolement des petites structures et partager des visions innovantes fait partie de nos priorités."
        },
        {
          question: "Vous participez très régulièrement à nos différents événements. Que venez-vous y chercher en tant que chef d'entreprise ?",
          answer: "J'y trouve une formidable source de sagesse et d'expérience. Ces rencontres permettent de puiser de l'inspiration non seulement auprès des autres membres, mais aussi des dynamiques du département du Doubs et du monde technologique en général."
        },
        {
          question: "Récemment, vous avez franchi un cap supplémentaire en rejoignant le Conseil d'Administration et en prenant la direction de la commission Newsletter. Qu'est-ce qui a motivé cet engagement plus profond ?",
          answer: "Je souhaitais m'impliquer pour mettre en lumière les progrès, la croissance et l'enthousiasme grandissant au sein de notre association. En reprenant l'édition de cette newsletter mensuelle en français, mon ambition est de partager des informations utiles et intrigantes pour nos lecteurs. De plus, c'est l'occasion idéale d'utiliser concrètement l'IA comme un véritable \"super-pouvoir\"."
        }
      ],
      membershipBullets: [
        "Badge Adhérent exclusif : Sceau numérique officiel de labellisation à intégrer sur votre site.",
        "Référencement (backlinks) dans l'annuaire : Boostez votre SEO technique grâce à un lien certifié.",
        "Accueillir un Digital Apéro : Une occasion unique de recevoir l'ensemble de l'écosystème.",
        "Pot de Rentrée réservé : Accès exclusif à nos grands rassemblements informels de networking.",
        "Mise en avant Interview : Une opportunité d'être interviewé et mis en valeur dans la newsletter."
      ]
    };
  }

  return {
    presidentTitle: "Le Mot du Président",
    presidentQuote: "Construisons ensemble l'avenir numérique de notre région !",
    presidentParagraphs: [
      "Chers membres et passionnés du numérique, après le formidable succès de notre Fête de l'Innovation en juin dernier, notre dynamique est plus forte que jamais ! Depuis notre dernière édition, l'écosystème a continué de vibrer au rythme du partage d'expertises concrètes. Nous tenons à vous remercier chaleureusement pour votre présence massive à nos derniers rendez-vous majeurs."
    ],
    recapTitle: "Retour sur nos récents événements",
    recapParagraphs: [
      "Tout d'abord, notre Digital Apéro dédié à la généralisation de la facturation électronique (qui entrera en vigueur dès le 1er septembre prochain). Un grand merci à Clément EYNAC (référent à la DGFiP du Doubs) pour son intervention cruciale d'une heure au Callahan, qui a permis à nos chefs d'entreprise, agences et éditeurs de logiciels de comprendre comment transformer cette obligation légale en levier de croissance.",
      "Hier à peine, nous avons également lancé notre tout premier Apéro IA chez Ninkasi autour de « La recette du prompting ». Un moment convivial et passionnant où nous avons pu constater que le prompt n'est pas une science exacte ou de la pâtisserie, mais bien une recette traditionnelle : chacun a la sienne, mais au final, c'est le résultat partagé qui compte !",
      "Face à ce succès, nous pérennisons ce format. Découvrez dès maintenant le programme de vos prochains rendez-vous !"
    ],
    agendaIntro: "Ne manquez pas notre nouveau rendez-vous récurrent ! Les Apéros IA se tiennent désormais chaque 2ème mardi du mois dans l'ambiance conviviale de la Brasserie Ninkasi à Besançon. Venez échanger, débattre et vous inspirer :",
    agendaEvents: [
      { date: "11 AOÛT 2026", title: "La rédaction web", desc: "« Comment faire 95% du travail avec l'IA et finir tout seul comme un humain responsable »" },
      { date: "8 SEPTEMBRE 2026", title: "L'IA et l'écologie", desc: "« La goutte d'eau qui fait déborder le vase ! La faute à la dernière goutte d'eau ? »" },
      { date: "13 OCTOBRE 2026", title: "IA et sécurité / confidentialité des données", desc: "« Ça fait longtemps qu'on fait n'importe quoi, mais grâce à l'IA on prend conscience que c'est important. »" },
      { date: "10 NOVEMBRE 2026", title: "Les agents IA", desc: "« La 2ème révolution industrielle en 3 ans : le boulot des IA classiques en danger ! »" }
    ],
    caNewsTitle: "ANNUAIRE & NOTRE COMMUNAUTÉ",
    caNewsIntro: "Faites rayonner vos compétences ! L'Annuaire des Compétences est le nouveau cœur battant de notre écosystème numérique. Propulsé par l'IA pour automatiser sa création, cet outil est une vitrine unique pour booster votre visibilité régionale.",
    caNewsBullet1: "👉 Créez votre fiche Annuaire : Vous n'avez pas encore votre fiche ? Ne restez pas dans l'ombre ! Que vous soyez membre ou non, créez dès maintenant votre profil sur notre site pour booster vos backlinks et vos opportunités d'affaires.",
    caNewsBullet2: "📱 Restons connectés : Pour ne rien rater des actualités de l'écosystème, des partages de projets et des coulisses de l'association, suivez absolument notre page LinkedIn.",
    interviewTitle: "FOCUS ADHÉRENT : L'Entretien",
    interviewSubtitle: "Bienvenue à Bruno Roy ! Chaque mois, nous donnons la parole à ceux qui font la richesse de notre réseau. Ce mois-ci, nous partons à la rencontre de Bruno Roy, nouvel adhérent de Silicon Comté.",
    guestName: "Bruno Roy",
    guestCompany: "GAME ON CONSULTING",
    guestRoleTag: "Conseil Business & Go-To-Market",
    guestBio: "Consultant indépendant basé à Besançon",
    guestQuote: "Vendre mieux, vendre plus, avec méthode : pour que la croissance cesse de dépendre du hasard.",
    guestImage: brunoRoyImg,
    qas: [
      {
        question: "Silicon Comté : Bruno, pouvez-vous nous présenter votre parcours ?",
        answer: "Bruno Roy : J’accompagne des dirigeants de TPE / PME sur ce qui impacte vraiment leur croissance : leur stratégie commerciale, leur marketing et leur organisation. Mon parcours mêle grande entreprise et structures à taille humaine, chez Orange France, Hexaom, Vivialys ou encore Cactus, après une formation à l'EM Normandie et un passage par Le Wagon en growth marketing. En parallèle, j'enseigne au CNAM Bourgogne-Franche-Comté et à l'ECM, ce qui m'oblige à garder des méthodes claires et transmissibles. Ma promesse tient en une phrase : vendre mieux, vendre plus, avec méthode. Beaucoup de PME ont un bon produit et un marché réel, mais un processus marketing et commercial construit au fil de l'eau. Mon travail consiste à le structurer pour que la croissance cesse de dépendre du hasard."
      },
      {
        question: "Silicon Comté : Vous venez tout juste de rejoindre Silicon Comté. Qu’est-ce qui vous a poussé à rejoindre l'association ?",
        answer: "Bruno Roy : Le métier d'indépendant expose à un vrai risque d'isolement, et je ne parle pas seulement du quotidien. On finit par raisonner en circuit fermé, avec ses propres réflexes et ses propres angles morts. Silicon Comté m'a paru être exactement l'endroit où me confronter à d'autres façons de faire. Il y a aussi une raison plus simple : je travaille pour des entreprises du territoire, et je voulais mieux connaître les acteurs qui le composent. Enfin, la dynamique portée par l'association depuis quelques mois est visible, et j'avais envie d'en faire partie dès à présent."
      },
      {
        question: "Silicon Comté : Vous participez à nos événements depuis peu. Que venez-vous y chercher en tant qu’indépendant ?",
        answer: "Bruno Roy : Trois choses, dans cet ordre. D'abord des rencontres qui n'auraient pas eu lieu autrement, parce que les meilleures opportunités ne viennent pas toujours d'une démarche frontale. Ensuite de la matière : entendre un dirigeant expliquer comment il a réglé un problème dans son activité vaut souvent mieux qu'un rapport sectoriel ou qu’un livre blanc. Et enfin, une forme de recul. Quand on accompagne des entreprises ou des apprenants au quotidien, il est agréable de se retrouver dans une salle où l'on écoute plus qu'on ne parle. Je viens aussi avec l'idée d'être utile : si mon regard sur un sujet peut faire gagner du temps à quelqu'un autour d'un verre, c'est déjà une bonne soirée."
      },
      {
        question: "Silicon Comté : Vous portez le regard d'un nouvel arrivant sur notre écosystème. Qu'est-ce qu'il vous inspire ?",
        answer: "Bruno Roy : Ce qui frappe en arrivant, c'est la densité de compétences rapportée à la taille du territoire. Il y a ici des entreprises et des indépendants dont le niveau technique n'a rien à envier aux grandes métropoles. Ce qui frappe ensuite, c'est que cette qualité reste souvent sous les radars, y compris auprès des PME régionales qui auraient tout intérêt à travailler avec elles. Autrement dit, le sujet n'est pas la compétence, il est la mise en visibilité et la mise en relation. C'est précisément le but de l'association. Mon second constat est plus personnel. Les structures que je croise ici ont, comme mes clients, une vraie expertise et pas toujours les moyens de s’offrir une grande visibilité. Il y a là un chantier collectif intéressant, et j'aimerais y contribuer."
      }
    ],
    membershipBullets: [
      "Obtenir son badge adhérent officiel et être propulsé en haut de liste de l'annuaire.",
      "Bénéficier de backlinks de qualité vers votre site internet.",
      "Avoir l'opportunité exclusive d'accueillir ou animer un 'Digital Apéro'.",
      "Accéder à nos événements exclusifs comme le Pot de rentrée de septembre en centre-ville."
    ]
  };
}

const monthsInFrench = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const getNextEditionDate = (lastDate: string) => {
  const parts = lastDate.split(' ');
  if (parts.length !== 2) return { date: 'Juillet 2026', dateUpper: 'JUILLET 2026', fullDate: '10 Juillet 2026' };
  const monthStr = parts[0];
  let year = parseInt(parts[1], 10);
  if (isNaN(year)) year = 2026;
  
  const monthIndex = monthsInFrench.findIndex(m => m.toLowerCase() === monthStr.toLowerCase());
  const nextMonthIndex = (monthIndex + 1) % 12;
  let nextYear = year;
  if (nextMonthIndex === 0) {
    nextYear += 1;
  }
  const nextMonthStr = monthsInFrench[nextMonthIndex];
  
  return {
    date: `${nextMonthStr} ${nextYear}`,
    dateUpper: `${nextMonthStr.toUpperCase()} ${nextYear}`,
    fullDate: `10 ${nextMonthStr} ${nextYear}`,
  };
};

export default function App() {
  const DEFAULT_EDITIONS: Edition[] = [
    {
      id: 2,
      editionNumber: 2,
      date: 'Août 2026',
      dateUpper: 'AOÛT 2026',
      fullDate: '5 Août 2026',
      referenceNumber: 'SC-NL-2026-N2',
    },
    {
      id: 1,
      editionNumber: 1,
      date: 'Juin 2026',
      dateUpper: 'JUIN 2026',
      fullDate: '10 Juin 2026',
      referenceNumber: 'SC-NL-2026-N1',
    }
  ];

  const [editions, setEditions] = React.useState<Edition[]>(() => {
    const saved = localStorage.getItem('silicon_comte_editions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out any stale higher edition numbers (>2)
        const validEditions = parsed.filter((ed: Edition) => ed.editionNumber <= 2);
        if (validEditions.length > 0) {
          return validEditions.map((ed: Edition) => {
            if (ed.editionNumber === 2) {
              return {
                ...ed,
                date: 'Août 2026',
                dateUpper: 'AOÛT 2026',
                fullDate: '5 Août 2026',
                referenceNumber: 'SC-NL-2026-N2',
              };
            }
            return ed;
          });
        }
      } catch (e) {
        // ignore and fallback
      }
    }
    return DEFAULT_EDITIONS;
  });

  const [activeEdition, setActiveEdition] = React.useState<Edition>(() => {
    const savedActiveId = localStorage.getItem('silicon_comte_active_edition_id');
    if (savedActiveId && editions) {
      const activeIdNum = parseInt(savedActiveId, 10);
      if (activeIdNum <= 2) {
        const found = editions.find(e => e.id === activeIdNum);
        if (found) {
          if (found.editionNumber === 2) {
            return {
              ...found,
              date: 'Août 2026',
              dateUpper: 'AOÛT 2026',
              fullDate: '5 Août 2026',
              referenceNumber: 'SC-NL-2026-N2',
            };
          }
          return found;
        }
      }
    }
    return editions.find(e => e.editionNumber === 2) || DEFAULT_EDITIONS[0];
  });

  React.useEffect(() => {
    if (activeEdition.editionNumber > 2) {
      const ed2 = editions.find(e => e.editionNumber === 2) || DEFAULT_EDITIONS[0];
      setActiveEdition(ed2);
    }
    if (editions.some(e => e.editionNumber > 2)) {
      setEditions(editions.filter(e => e.editionNumber <= 2));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('silicon_comte_editions', JSON.stringify(editions));
  }, [editions]);

  React.useEffect(() => {
    if (activeEdition) {
      localStorage.setItem('silicon_comte_active_edition_id', String(activeEdition.id));
    }
  }, [activeEdition]);

  const createNewEdition = () => {
    const lastEd = editions.reduce((max, ed) => ed.editionNumber > max.editionNumber ? ed : max, editions[0]);
    const nextEdNo = lastEd.editionNumber + 1;
    const nextDates = getNextEditionDate(lastEd.date);
    
    const newEd: Edition = {
      id: nextEdNo,
      editionNumber: nextEdNo,
      date: nextDates.date,
      dateUpper: nextDates.dateUpper,
      fullDate: nextDates.fullDate,
      referenceNumber: `SC-NL-2026-N${nextEdNo}`,
    };
    
    const updated = [...editions, newEd];
    setEditions(updated);
    setActiveEdition(newEd);
  };

  const getReferenceForEdition = (edNo: number) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `REF-${year}${month}${day}-${hours}${minutes}-V${edNo}`;
  };

  const referenceNumber = getReferenceForEdition(activeEdition.editionNumber);
  const content = getEditionContent(activeEdition.editionNumber);

  const newsletterRef = React.useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showFutureMaterial, setShowFutureMaterial] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
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
      pdf.save(`Silicon_Comte_Newsletter_No${activeEdition.editionNumber}.pdf`);
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
    const content = getEditionContent(activeEdition.editionNumber);
    let mdContent = `# Silicon Comté — Édition N°${activeEdition.editionNumber} — ${activeEdition.dateUpper || activeEdition.date.toUpperCase()} | Réf: ${activeEdition.referenceNumber}
L'Écosystème : Le Guide de l'Innovation Numérique en BFC
`;

    if (content.recapParagraphs && content.recapParagraphs.length > 0) {
      mdContent += `\n---\n\n## ${content.recapTitle}\n\n${content.recapParagraphs.join('\n\n')}\n`;
    }

    mdContent += `\n---\n\n## ${content.presidentTitle} (Antoine Bouet)\n\n**"${content.presidentQuote}"**\n\n${content.presidentParagraphs.join('\n\n')}\n`;

    mdContent += `\n---\n\n## ${content.caNewsTitle}\n\n${content.caNewsIntro}\n\n- ${content.caNewsBullet1}\n- ${content.caNewsBullet2}\n`;

    mdContent += `\n---\n\n## ${content.interviewTitle}\n**Invité : ${content.guestName} (${content.guestCompany})**\n*${content.guestBio}*\n\n> "${content.guestQuote}"\n\n${content.qas.map(qa => `- **${qa.question}**\n  - ${qa.answer}`).join('\n\n')}\n`;

    mdContent += `\n---\n\n## Agenda des Rencontres\n\n${content.agendaIntro}\n\n${content.agendaEvents.map(ev => `- **${ev.date} — ${ev.title}** : ${ev.desc}`).join('\n')}\n`;

    mdContent += `\n---\n\n## Pourquoi nous rejoindre ?\n\n${content.membershipBullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n`;

    mdContent += `\n---\n\n## Rejoignez l'impulsion de l'innovation\n\nDevenez acteur du dynamisme numérique en Franche-Comté ! Que vous soyez une entreprise, un indépendant, une startup ou un étudiant, adhérer à Silicon Comté vous permet de participer à nos rencontres, de figurer dans l'annuaire des compétences, de booster votre visibilité et de rejoindre un réseau solidaire et innovant.\n\n[S'INSCRIRE / RENOUVELER L'ADHÉSION](https://www.siliconcomte.com)\n\n---\n© 2026 SILICON COMTÉ. TOUS DROITS RÉSERVÉS.\n`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Silicon_Comte_Newsletter_No${activeEdition.editionNumber}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateHtmlEmail = () => {
    const content = getEditionContent(activeEdition.editionNumber);
    const isDevOrSandbox = !window.location.origin || 
      window.location.origin.includes('localhost') || 
      window.location.origin.includes('ais-dev') || 
      window.location.origin.includes('ais-pre');
    const origin = isDevOrSandbox
      ? 'https://silicon-comte-newsletter.web.app'
      : window.location.origin;
    const getAbsoluteUrl = (url: string) => {
      if (!url) return '';
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (url.startsWith('data:')) return url;
      return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
    };
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Silicon Comté Newsletter — Édition N°${activeEdition.editionNumber}</title>
  <style>
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
<body style="margin: 0; padding: 0; background-color: #0c111d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0c111d; padding: 40px 0 60px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="640" class="responsive-table" style="background-color: #fcf9f8; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.4); border: 1px solid #1e293b;">
          
          <!-- TOP BANNER ACCENT -->
          <tr>
            <td style="background-color: #006685; height: 8px; font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- NAVBAR LOGO -->
          <tr>
            <td style="background-color: #ffffff; padding: 24px 40px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <img src="${getAbsoluteUrl(logoSiliconComte)}" alt="Silicon Comté" style="max-width: 200px; height: auto;" />
            </td>
          </tr>

          <!-- BRAND COVER HEADER BLOCK -->
          <tr>
            <td style="background-color: #090d16; padding: 45px 40px 40px 40px; border-bottom: 4px solid #fbd800;" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="color: #94a3b8; font-size: 12px; font-weight: 800; font-family: monospace; letter-spacing: 2.5px;">
                    SILICON COMTÉ NEWSLETTER
                  </td>
                  <td align="right" style="background-color: #fbd800; color: #090d16; font-size: 10px; font-weight: 950; padding: 4px 12px; border-radius: 4px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                    ÉDITION N°${activeEdition.editionNumber}
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
                  <td style="border-top: 1px solid #1e293b; padding-top: 15px; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-family: monospace;">
                    Édition N°${activeEdition.editionNumber} — ${activeEdition.dateUpper || activeEdition.date.toUpperCase()} | Réf: ${activeEdition.referenceNumber}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${content.recapParagraphs && content.recapParagraphs.length > 0 ? `
          <!-- 1. RECENT RECAP -->
          <tr>
            <td style="padding: 40px; background-color: #0f172a; color: #ffffff;" class="mobile-padding">
              <p style="color: #fbd800; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-family: monospace; margin-top: 0; margin-bottom: 8px;">
                ⚡ RÉTROSPECTIVE ÉVÉNEMENT
              </p>
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 900; margin-top: 0; margin-bottom: 25px; font-family: sans-serif; text-transform: uppercase;">
                ${content.recapTitle}
              </h2>

              <!-- Event 1 Card: DGFiP -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 16px; margin-bottom: 20px; border: 1px solid #334155;">
                <tr>
                  <td style="padding: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="72" valign="top" style="padding-right: 18px;">
                          <img src="${getAbsoluteUrl(dgfipLogoImg)}" alt="DGFiP Logo" width="64" height="64" style="width: 64px; height: 64px; border-radius: 12px; border: 2px solid #006685; display: block; object-fit: cover; background-color: #ffffff;" referrerPolicy="no-referrer" />
                        </td>
                        <td valign="top">
                          <p style="color: #fbd800; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace; margin: 0 0 4px 0;">
                            DIGITAL APÉRO • DGFIP
                          </p>
                          <h3 style="color: #ffffff; font-size: 16px; font-weight: 800; margin: 0 0 6px 0; font-family: sans-serif;">
                            Généralisation de la Facturation Électronique
                          </h3>
                          <p style="color: #006685; font-size: 11px; font-weight: 700; margin: 0 0 10px 0; font-family: sans-serif;">
                            📍 Le Callahan • 👤 Clément EYNAC (DGFiP du Doubs)
                          </p>
                          <p style="color: #cbd5e1; font-size: 13.5px; line-height: 1.6; margin: 0; font-family: sans-serif;">
                            ${content.recapParagraphs[0]}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Event 2 Card: Ninkasi -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 16px; margin-bottom: 20px; border: 1px solid #334155;">
                <tr>
                  <td style="padding: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="72" valign="top" style="padding-right: 18px;">
                          <img src="${getAbsoluteUrl(ninkasiLogoImg)}" alt="Ninkasi Logo" width="64" height="64" style="width: 64px; height: 64px; border-radius: 12px; border: 2px solid #fbd800; display: block; object-fit: cover; background-color: #ffffff;" referrerPolicy="no-referrer" />
                        </td>
                        <td valign="top">
                          <p style="color: #fbd800; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace; margin: 0 0 4px 0;">
                            APÉRO IA #01 • NINKASI
                          </p>
                          <h3 style="color: #ffffff; font-size: 16px; font-weight: 800; margin: 0 0 6px 0; font-family: sans-serif;">
                            La Recette du Prompting
                          </h3>
                          <p style="color: #fbd800; font-size: 11px; font-weight: 700; margin: 0 0 10px 0; font-family: sans-serif;">
                            📍 Brasserie Ninkasi • 🤖 Atelier Pratique
                          </p>
                          <p style="color: #cbd5e1; font-size: 13.5px; line-height: 1.6; margin: 0; font-family: sans-serif;">
                            ${content.recapParagraphs[1]}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${content.recapParagraphs[2] ? `
              <!-- Outlook Banner -->
              <div style="background-color: #006685; border-radius: 12px; padding: 16px 20px; color: #ffffff; font-size: 13.5px; font-weight: 600; font-family: sans-serif; text-align: center;">
                ✨ ${content.recapParagraphs[2]}
              </div>
              ` : ''}
            </td>
          </tr>
          ` : ''}

          <!-- 2. LE MOT DU PRÉSIDENT -->
          <tr>
            <td style="padding: 40px; background-color: #fcf9f8;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" align="left" style="margin-right: 25px; margin-bottom: 20px;" class="responsive-table mobile-center">
                      <tr>
                        <td align="center" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 15px;">
                          <img src="${getAbsoluteUrl(antoineBouetImg)}" alt="Antoine Bouet" width="110" height="110" style="border-radius: 50%; border: 3px solid #006685; display: block; object-fit: cover;" />
                          <div style="margin-top: 12px; font-size: 14px; font-weight: bold; color: #0f172a; font-family: sans-serif;">Antoine Bouet</div>
                          <div style="font-size: 9px; color: #006685; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; font-family: monospace; margin-top: 3px;">Président</div>
                        </td>
                      </tr>
                    </table>
                    
                    <h2 style="color: #006685; font-size: 24px; font-weight: 900; margin-top: 0; margin-bottom: 20px; font-family: sans-serif;">
                      ${content.presidentTitle}
                    </h2>
                    
                    <div style="border-left: 4px solid #fbd800; margin: 0 0 25px 0; padding-left: 20px; font-style: italic; font-size: 17px; color: #0f172a; font-weight: 600; font-family: Georgia, serif;">
                      "${content.presidentQuote}"
                    </div>
                    
                    ${content.presidentParagraphs.map(p => `<p style="color: #334155; font-size: 14.5px; line-height: 1.65; margin: 0 0 16px 0; font-family: sans-serif;">${p}</p>`).join('')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CA NEWS -->
          <tr>
            <td style="padding: 40px; background-color: #ffffff; border-top: 1px solid #e2e8f0;" class="mobile-padding">
              <h2 style="color: #006685; font-size: 22px; font-weight: 900; margin-top: 0; margin-bottom: 15px; font-family: sans-serif;">
                ${content.caNewsTitle}
              </h2>
              <p style="color: #334155; font-size: 14.5px; line-height: 1.65; font-family: sans-serif; margin-bottom: 15px;">
                ${content.caNewsIntro}
              </p>
              <ul style="color: #334155; font-size: 14px; line-height: 1.6; font-family: sans-serif; padding-left: 20px;">
                <li style="margin-bottom: 10px;">${content.caNewsBullet1}</li>
                <li style="margin-bottom: 10px;">${content.caNewsBullet2}</li>
              </ul>
            </td>
          </tr>

          <!-- INTERVIEW -->
          <tr>
            <td style="padding: 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;" class="mobile-padding">
              <h2 style="color: #0f172a; font-size: 22px; font-weight: 900; margin-top: 0; margin-bottom: 5px; font-family: sans-serif;">
                ${content.interviewTitle}
              </h2>
              <p style="color: #64748b; font-size: 13px; margin-top: 0; margin-bottom: 20px; font-family: sans-serif;">
                ${content.interviewSubtitle}
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px;">
                <tr>
                  <td width="100" valign="top">
                    <img src="${getAbsoluteUrl(content.guestImage)}" alt="${content.guestName}" width="90" height="90" style="border-radius: 50%; object-fit: cover;" />
                  </td>
                  <td valign="top" style="padding-left: 15px; font-family: sans-serif;">
                    <div style="font-size: 18px; font-weight: 900; color: #0f172a;">${content.guestName}</div>
                    <div style="font-size: 12px; font-weight: bold; color: #006685; margin-bottom: 6px;">${content.guestCompany} • ${content.guestRoleTag}</div>
                    <div style="font-size: 12px; color: #64748b; line-height: 1.4;">${content.guestBio}</div>
                  </td>
                </tr>
              </table>

              <div style="background-color: #0f172a; color: #fbd800; padding: 15px 20px; border-radius: 12px; font-style: italic; font-size: 14px; margin-bottom: 25px; font-family: sans-serif;">
                "${content.guestQuote}"
              </div>

              ${content.qas.map(qa => {
                const match = qa.answer.match(/^([^:]+:\s*)([\s\S]*)$/);
                const formattedAns = match 
                  ? `<span style="display: inline-block; background-color: #e0f2fe; color: #006685; border: 1px solid #7dd3fc; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 6px; font-family: sans-serif; vertical-align: middle;">${match[1]}</span><span style="vertical-align: middle;">${match[2]}</span>`
                  : qa.answer;
                return `
                <div style="margin-bottom: 22px; font-family: sans-serif;">
                  <div style="font-weight: 800; color: #006685; font-size: 14px; margin-bottom: 8px;">${qa.question}</div>
                  <div style="color: #334155; font-size: 13.5px; line-height: 1.6;">${formattedAns}</div>
                </div>
              `;
              }).join('')}
            </td>
          </tr>

          <!-- AGENDA -->
          <tr>
            <td style="padding: 40px; background-color: #ffffff; border-top: 1px solid #e2e8f0;" class="mobile-padding">
              <h2 style="color: #006685; font-size: 22px; font-weight: 900; margin-top: 0; margin-bottom: 15px; font-family: sans-serif;">
                AGENDA DES RENCONTRES
              </h2>
              <p style="color: #64748b; font-size: 13.5px; line-height: 1.5; margin-bottom: 20px; font-family: sans-serif;">
                ${content.agendaIntro}
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                ${content.agendaEvents.map(ev => `
                  <tr>
                    <td style="padding-bottom: 15px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td width="110" valign="top" style="background-color: #006685; color: #ffffff; border-radius: 6px; text-align: center; padding: 6px 10px; font-weight: bold; font-size: 10px; font-family: monospace;">
                            ${ev.date}
                          </td>
                          <td valign="top" style="padding-left: 15px; font-size: 13.5px; line-height: 1.5; color: #334155; font-family: sans-serif;">
                            <strong style="color: #0f172a;">${ev.title} :</strong> ${ev.desc}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 45px 40px; background-color: #0c111d; border-top: 4px solid #fbd800; text-align: center;" class="mobile-padding">
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 900; margin-top: 0; margin-bottom: 15px; font-family: sans-serif;">
                Rejoignez l'impulsion de l'innovation
              </h2>
              <p style="color: #94a3b8; font-size: 13.5px; line-height: 1.5; margin-top: 0; margin-bottom: 25px; font-family: sans-serif;">
                Devenez acteur du dynamisme numérique en Franche-Comté ! Adhérer à Silicon Comté vous permet de participer à nos rencontres, de figurer dans l'annuaire des compétences et d'intégrer un réseau solidaire.
              </p>
              <a href="https://www.siliconcomte.com" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #fbd800; color: #090d16; font-family: sans-serif; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase; border-radius: 8px;">
                S'inscrire / Renouveler l'adhésion
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #090d16; padding: 30px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0; font-family: monospace;">
                Silicon Comté • Édition N°${activeEdition.editionNumber}
              </p>
              <p style="color: #64748b; font-size: 10px; margin: 0; font-family: sans-serif;">
                © 2026 SILICON COMTÉ. TOUS DROITS RÉSERVÉS. ${referenceNumber}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
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
                            Relais Info N°${activeEdition.editionNumber} : Nouvelle Dynamique de Communication — Des outils repensés pour vous connecter
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
                Pourquoi nous rejoindre ?
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
                        <!-- Guest Photo -->
                        <td width="80" valign="top" class="column" align="center" style="padding-bottom: 12px;">
                          <img src="${getAbsoluteUrl(content.guestImage)}" alt="${content.guestName}" width="72" height="72" style="width: 72px; height: 72px; border-radius: 12px; border: 3px solid #006685; display: block; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.15);" referrerPolicy="no-referrer" />
                        </td>
                        
                        <!-- Guest Info -->
                        <td valign="top" class="column" style="padding-left: 20px;">
                          <h3 style="color: #090d16; font-size: 18px; font-weight: 850; margin: 0 0 4px 0; font-family: sans-serif;">
                            ${content.guestName}
                          </h3>
                          <p style="color: #006685; font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 1px; font-family: monospace;">
                            ${content.guestCompany} • ${content.guestRoleTag}
                          </p>
                          <p style="color: #475569; font-size: 13.5px; line-height: 1.5; margin: 0; font-family: sans-serif; font-style: italic;">
                            ${content.guestBio}
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
                Silicon Comté • Édition N°${activeEdition.editionNumber}
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
    link.setAttribute('download', `Silicon_Comte_Newsletter_No${activeEdition.editionNumber}.html`);
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
              src={logoSiliconComte} 
              alt="Silicon Comté — Association du numérique et de l'innovation en Franche-Comté" 
              style={{ maxWidth: '210px' }} 
              className="w-full mix-blend-multiply hover:opacity-90 transition-opacity" 
            />
          </a>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Glass-morphic Metadata Bar */}
            <div className="h-9 flex items-center gap-3 md:gap-4 bg-slate-900 border border-slate-800 text-white px-5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-xs font-mono font-bold tracking-widest uppercase leading-none">
              <span className="text-highlighter flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-highlighter animate-pulse shrink-0"></span>
                ÉDITION N°{activeEdition.editionNumber} — {activeEdition.dateUpper}
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-300 hidden sm:inline">Réf: {activeEdition.referenceNumber}</span>
            </div>

            {/* Hamburger Button */}
            <button
              data-html2canvas-ignore="true"
              onClick={() => setIsMenuOpen(true)}
              className="h-9 w-9 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)] group"
              title="Ouvrir le menu d'export"
            >
              <Menu className="w-4 h-4 text-highlighter group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HIGH-IMPACT MULTI-LAYERED HERO SECTION */}
      <header className="relative w-full overflow-hidden bg-slate-950 pt-24 pb-32 md:pt-36 md:pb-48 px-6 md:px-12 text-white border-b-8 border-highlighter">
        {/* Underlay Grid & Imagery with custom blend and darkness overlay */}
        <div className={`absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat ${isGenerating ? '' : 'mix-blend-luminosity'}`} style={{ backgroundImage: `url(${illustrationHome})` }}></div>
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
                N°{activeEdition.editionNumber} | L'ÉCOSYSTÈME
              </span>
            </motion.h1>

            <motion.p 
              {...anim({ opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { duration: 0.8, delay: 0.2 })}
              className="mt-8 text-xl md:text-2xl font-light text-slate-300 max-w-2xl font-display leading-relaxed"
            >
              Le Guide de l'Innovation Numérique en BFC
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
              <p className="text-4xl font-extrabold font-display text-white mt-1 tracking-tight">{activeEdition.date}</p>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-6 flex justify-center items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 rounded-full w-max border border-emerald-500/20 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                CONSEIL ACTIF
              </div>
            </motion.div>
          </div>

        </div>
      </header>

      {/* 3. SECTION 1: RÉTROSPECTIVE ÉVÉNEMENT (CHAPTER 1) */}
      {content.recapParagraphs && content.recapParagraphs.length > 0 && (
        <section className="py-20 md:py-28 px-6 md:px-12 bg-slate-900 text-white relative shadow-md z-10 -mt-16 rounded-t-4xl max-w-[95%] lg:max-w-[1340px] mx-auto border-t-8 border-highlighter">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeInUp}>
              <p className="font-mono text-highlighter font-extrabold tracking-widest uppercase mb-3 text-xs md:text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-highlighter animate-pulse shrink-0"></span>
                Rétrospective Événement
              </p>
              <h2 className="headline text-3xl md:text-5xl font-black text-white mb-10 uppercase tracking-tight">
                {content.recapTitle}
              </h2>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Event 1: DGFiP */}
                <div className="bg-slate-950/90 rounded-3xl p-8 border border-slate-800/90 shadow-xl hover:border-[#006685] transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={dgfipLogoImg} 
                          alt="DGFiP Logo" 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#006685] bg-white p-0.5 shadow-md shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="px-3 py-1 bg-[#006685]/20 text-[#006685] text-xs font-mono font-bold uppercase rounded-full border border-[#006685]/40 inline-block mb-1">
                            Digital Apéro
                          </span>
                          <h3 className="text-xl font-bold text-white group-hover:text-highlighter transition-colors">
                            Facturation Électronique
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 text-xs font-medium text-slate-300">
                      <span className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                        <User size={14} className="text-[#006685]" />
                        Clément EYNAC (DGFiP)
                      </span>
                      <span className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                        <MapPin size={14} className="text-highlighter" />
                        Le Callahan
                      </span>
                      <span className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 text-highlighter">
                        <Calendar size={14} />
                        Échéance 1er Sept.
                      </span>
                    </div>

                    <p className="text-slate-300 font-light text-base leading-relaxed">
                      {content.recapParagraphs[0]}
                    </p>
                  </div>
                </div>

                {/* Event 2: Ninkasi */}
                <div className="bg-slate-950/90 rounded-3xl p-8 border border-slate-800/90 shadow-xl hover:border-highlighter transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={ninkasiLogoImg} 
                          alt="Ninkasi Logo" 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-highlighter bg-white p-0.5 shadow-md shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="px-3 py-1 bg-highlighter/10 text-highlighter text-xs font-mono font-bold uppercase rounded-full border border-highlighter/30 inline-block mb-1">
                            Apéro IA #01
                          </span>
                          <h3 className="text-xl font-bold text-white group-hover:text-highlighter transition-colors">
                            La Recette du Prompting
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 text-xs font-medium text-slate-300">
                      <span className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                        <MapPin size={14} className="text-highlighter" />
                        Brasserie Ninkasi
                      </span>
                      <span className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-400" />
                        Atelier Pratique IA
                      </span>
                    </div>

                    <p className="text-slate-300 font-light text-base leading-relaxed">
                      {content.recapParagraphs[1]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Outlook Banner */}
              {content.recapParagraphs[2] && (
                <div className="bg-gradient-to-r from-[#006685]/30 via-slate-950 to-slate-900 p-6 md:p-8 rounded-2xl border border-[#006685]/50 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-highlighter/10 border border-highlighter/30 flex items-center justify-center shrink-0">
                      <Sparkles size={24} className="text-highlighter" />
                    </div>
                    <p className="text-slate-200 text-base md:text-lg font-medium">
                      {content.recapParagraphs[2]}
                    </p>
                  </div>
                  <div className="shrink-0 px-4 py-2.5 bg-slate-900/90 text-highlighter border border-highlighter/30 text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-inner">
                    <Calendar size={15} className="text-highlighter shrink-0" />
                    <span>Retrouvez toutes les dates dans l'agenda ci-dessous 👇</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* 3.5 SECTION 2: EDITORIAL (LE MOT DU PRÉSIDENT - CHAPTER 2) */}
      <section className={`py-20 md:py-28 px-6 md:px-12 bg-white relative z-10 ${content.recapParagraphs && content.recapParagraphs.length > 0 ? 'border-y border-slate-200/60' : '-mt-16 rounded-t-4xl max-w-[95%] lg:max-w-[1340px] mx-auto border-t-8 border-highlighter shadow-md'}`}>
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
                    src={antoineBouetImg} 
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
                <div className="flex justify-between"><span>Date d'édition&nbsp;:</span> <span className="font-semibold text-slate-600">{activeEdition.fullDate}</span></div>
                <div className="flex justify-between"><span>Validation&nbsp;:</span> <span className="font-semibold text-[#006685]">Validé par le Bureau</span></div>
                <div className="flex justify-between"><span>Référence&nbsp;:</span> <span className="font-semibold text-slate-600">SC-NL-2026-N{activeEdition.editionNumber}</span></div>
              </div>
            </div>

            {/* Right Column: Dynamic Editorial Content and Quotation */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="headline text-4xl md:text-5xl text-slate-950 !normal-case tracking-tight font-extrabold !leading-snug">
                  {content.presidentTitle}
                </h2>
                <span className="block w-16 h-1 bg-[#006685] mt-6"></span>
              </div>

              <div className="text-slate-700 leading-relaxed text-base md:text-lg space-y-6 font-light">
                <div className="relative pl-6 md:pl-10 border-l-4 border-highlighter mb-10 py-2">
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                    "{content.presidentQuote}"
                  </p>
                </div>

                {content.presidentParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. SECTION 2: ACTUALITÉS DU CONSEIL D'ADMINISTRATION - ANNUAIRE & COMMUNAUTÉ (Visual Showcase) */}
      <section className="py-24 md:py-32 bg-slate-50 relative border-y border-slate-200/60 overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <motion.div {...fadeInUp}>
              <p className="font-mono text-[#006685] font-extrabold tracking-widest uppercase mb-3 text-xs md:text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                Actualités de l'écosystème
              </p>
              <h2 className="headline text-4xl md:text-5xl !normal-case text-slate-950 font-black tracking-tight">
                {content.caNewsTitle}
              </h2>
            </motion.div>

            {/* Ecosystem Live Badge Header */}
            <motion.div 
              {...anim({ rotate: -2, scale: 0.95 }, { rotate: 0, scale: 1 }, undefined, 'whileInView')}
              viewport={{ once: true }}
              className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-lg border border-slate-200/80"
            >
              <div className="w-10 h-10 rounded-xl bg-[#006685] text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono text-[#006685] font-black uppercase tracking-wider block">
                  ÉCOSYSTÈME FRANCHE-COMTÉ
                </span>
                <span className="text-xs font-extrabold text-slate-950 block">
                  Annuaire Régional 2026
                </span>
              </div>
            </motion.div>
          </div>
          
          {/* Main Visual Showcase Grid */}
          <div className="space-y-12 max-w-6xl mx-auto">
            
            {/* 1. Hero Feature Card: Annuaire des Compétences & Vie de l'association */}
            <motion.div 
              {...fadeInUp}
              className="bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden text-white grid grid-cols-1 lg:grid-cols-12 gap-0 group"
            >
              {/* Left Column: Official Silicon Comté Regional Showcase */}
              <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-[460px] overflow-hidden bg-slate-900 flex flex-col justify-between p-6 md:p-8">
                {/* Clean Abstract Network Background (no burnt-in text) */}
                <img 
                  src={annuaireCleanNetwork} 
                  alt="Écosystème Numérique Silicon Comté Franche-Comté" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 z-10"></div>
                
                {/* Top Badge Overlay with Legible White Logo Container */}
                <div className="relative z-20 flex justify-between items-center gap-2">
                  <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2">
                    <img src={logoSiliconComte} alt="Silicon Comté" className="h-5 w-auto object-contain" />
                    <span className="text-[#006685] text-[10px] font-mono font-black uppercase tracking-wider border-l border-slate-200 pl-2">
                      BFC RÉSEAU
                    </span>
                  </div>
                  <span className="px-3 py-1.5 bg-highlighter text-slate-950 font-mono font-black text-[10px] uppercase rounded-full shadow-md flex items-center gap-1.5">
                    ⚡ IA PROPULSÉ
                  </span>
                </div>

                {/* Center Regional Motto Box */}
                <div className="relative z-20 my-auto py-4">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-2">
                    <p className="text-xs font-semibold text-slate-200 leading-snug">
                      « Favoriser le développement d'un écosystème numérique en Franche-Comté »
                    </p>
                    <p className="text-[11px] font-mono text-highlighter font-bold italic">
                      Apprenons à nous connaître pour mieux nous valoriser !
                    </p>
                  </div>
                </div>

                {/* Bottom Pertinent Tags & Search Interactive Preview */}
                <div className="relative z-20">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-3">
                    <div className="flex items-center gap-2.5 bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-400 text-xs font-mono">
                      <Search size={14} className="text-highlighter shrink-0" />
                      <span className="text-slate-300 font-sans text-xs truncate">Trouver un expert, agence, startup...</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['IA & Data', 'Dev Software', 'Cyber', 'UX & Design', 'SEO'].map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700/90 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative Content */}
              <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between bg-slate-950 relative z-20">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[11px] text-highlighter font-extrabold uppercase tracking-widest bg-highlighter/10 px-3 py-1 rounded-full border border-highlighter/20">
                      INFO CA // ÉDITION #{activeEdition.editionNumber}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight uppercase mb-6 leading-tight">
                    Vie de l'association & <br />
                    <span className="text-highlighter">Annuaire des Compétences</span>
                  </h3>

                  <p className="text-slate-300 font-light text-base md:text-lg leading-relaxed mb-8">
                    {content.caNewsIntro}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pt-6 border-t border-slate-850">
                    <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center">
                      <span className="text-highlighter font-black font-display text-xl block">120+</span>
                      <span className="text-[11px] text-slate-400 uppercase font-mono font-bold block mt-0.5">Acteurs Référencés</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center">
                      <span className="text-emerald-400 font-black font-display text-xl block">SEO +</span>
                      <span className="text-[11px] text-slate-400 uppercase font-mono font-bold block mt-0.5">Backlinks Web</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center">
                      <span className="text-cyan-400 font-black font-display text-xl block">100% IA</span>
                      <span className="text-[11px] text-slate-400 uppercase font-mono font-bold block mt-0.5">Fiches Auto</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-850">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    Propulsé par le réseau Silicon Comté
                  </span>
                  <a 
                    href="https://www.siliconcomte.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-highlighter text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    Explorer l'Annuaire <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* 2. Actionable Grid: Fiche Annuaire + LinkedIn Community */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Card A: Create Your Directory Listing */}
              {content.caNewsBullet1 && (
                <motion.div 
                  {...fadeInUp}
                  className="bg-white rounded-[2rem] border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:border-[#006685]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Card Header Preview */}
                    <div className="bg-gradient-to-br from-[#006685]/10 via-slate-50 to-amber-500/10 p-5 rounded-2xl border border-[#006685]/20 mb-6 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-black uppercase text-[#006685] tracking-widest bg-white px-2.5 py-1 rounded-full border border-[#006685]/20 shadow-xs">
                          AXE MAJEUR // AXE 01
                        </span>
                        <UserPlus size={18} className="text-[#006685]" />
                      </div>
                      <h4 className="font-display font-black text-xl text-slate-950 uppercase tracking-tight mb-2">
                        {content.caNewsBullet1.includes(':') 
                          ? content.caNewsBullet1.split(':')[0].replace(/^[👉📱🌐\s]+/, '').trim()
                          : "Créez votre fiche Annuaire"}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Ouvert aux membres & non-membres
                      </div>
                    </div>

                    <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed mb-6">
                      {content.caNewsBullet1.includes(':') 
                        ? content.caNewsBullet1.split(':').slice(1).join(':').trim() 
                        : content.caNewsBullet1}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#006685] uppercase">
                      ACTION CA
                    </span>
                    <a 
                      href="https://www.siliconcomte.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950 group-hover:text-[#006685] transition-colors"
                    >
                      Ajouter ma fiche <ArrowRight size={15} />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Card B: LinkedIn Ecosystem Community */}
              {content.caNewsBullet2 && (
                <motion.div 
                  {...fadeInUp}
                  className="bg-white rounded-[2rem] border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:border-[#0077b5]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Card Header Preview for LinkedIn */}
                    <div className="bg-gradient-to-br from-[#0077b5]/10 via-slate-50 to-blue-500/10 p-5 rounded-2xl border border-[#0077b5]/20 mb-6 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-black uppercase text-[#0077b5] tracking-widest bg-white px-2.5 py-1 rounded-full border border-[#0077b5]/20 shadow-xs flex items-center gap-1.5">
                          <Linkedin size={12} className="text-[#0077b5]" /> LINKEDIN COMMU
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md">
                          1 500+ abonnés
                        </span>
                      </div>
                      <h4 className="font-display font-black text-xl text-slate-950 uppercase tracking-tight mb-2">
                        {content.caNewsBullet2.includes(':') 
                          ? content.caNewsBullet2.split(':')[0].replace(/^[👉📱🌐\s]+/, '').trim()
                          : "Restons connectés"}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#0077b5]"></span>
                        Actualités & coulisses en direct
                      </div>
                    </div>

                    <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed mb-6">
                      {content.caNewsBullet2.includes(':') 
                        ? content.caNewsBullet2.split(':').slice(1).join(':').trim() 
                        : content.caNewsBullet2}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0077b5] uppercase flex items-center gap-1.5">
                      <Linkedin size={14} /> Silicon Comté
                    </span>
                    <a 
                      href="https://www.linkedin.com/company/silicon-comte/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950 group-hover:text-[#0077b5] transition-colors"
                    >
                      Page LinkedIn <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.div>
              )}

            </div>

          </div>
          
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

      {/* SECTION 5.5: MICRO-INTERVIEW WITH GUEST */}
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
                  {content.interviewTitle.split(':')[0]}<br />
                  <span className={`${isGenerating ? 'text-[#006685]' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#006685] to-cyan-600'} font-extrabold`}>
                    {content.interviewTitle.split(':')[1] || "L'Entretien"}
                  </span>
                </h2>

                {/* Profile Widget Card */}
                <div className="bg-slate-50/40 border border-slate-200/60 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                  <div className="relative group mb-6">
                    {!isGenerating && <div className="absolute -inset-1.5 bg-gradient-to-r from-highlighter to-[#006685] rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>}
                    
                    {/* Stylish Portrait Image Block */}
                    <img 
                      src={content.guestImage} 
                      alt={content.guestName} 
                      className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover shadow-md relative z-10 border-4 border-white select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h3 className="font-display font-black text-2xl text-slate-950 uppercase tracking-tight">{content.guestName}</h3>
                  
                  <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                    <span className="h-6 inline-flex items-center justify-center text-[#006685] font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 bg-white border border-slate-200/50 rounded-full shadow-sm leading-none">
                      {content.guestRoleTag}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-slate-200/60 pt-6 w-full text-center lg:text-left">
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-2">Entité professionnelle</p>
                    <p className="font-display font-extrabold text-slate-900 text-lg uppercase tracking-tight">{content.guestCompany}</p>
                    <p className="text-slate-500 text-sm font-light mt-1.5 leading-relaxed">
                      {content.guestBio}
                    </p>
                  </div>

                  {/* Quoted highlight block */}
                  <div className="mt-8 bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 relative z-10 w-full text-left">
                    <span className="absolute -top-3 left-4 text-4xl font-display font-black text-highlighter leading-none">“</span>
                    <p className="font-sans font-medium text-slate-200 text-xs leading-relaxed italic pt-1 text-center lg:text-left">
                      {content.guestQuote}
                    </p>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* Right Column: Q&A Thread Container */}
            <div className="lg:col-span-8 flex flex-col gap-10 md:gap-14">
              {content.qas.map((qa, idx) => (
                <motion.div key={idx} {...fadeInUp} className="flex flex-col gap-5 border-b border-slate-100 pb-10 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#006685]/10 shrink-0 flex items-center justify-center border border-[#006685]/20 mt-1">
                      <MessageSquare size={18} className="text-[#006685]" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-display font-extrabold text-slate-950 leading-snug">
                        {qa.question}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="lg:pl-14 text-slate-700 leading-relaxed text-base md:text-[17px] whitespace-pre-line space-y-3">
                    {(() => {
                      const match = qa.answer.match(/^([^:]+:\s*)([\s\S]*)$/);
                      if (match) {
                        const speakerName = match[1].replace(' :', '').replace(':', '').trim();
                        return (
                          <p className="leading-relaxed">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 mr-2.5 mb-1.5 md:mb-0 rounded-xl bg-[#006685]/10 border border-[#006685]/20 text-[#006685] font-extrabold text-xs uppercase tracking-wider shadow-sm select-none align-middle">
                              <User size={13} className="text-[#006685] shrink-0" />
                              {speakerName} :
                            </span>
                            <span className="text-slate-800 font-normal">{match[2]}</span>
                          </p>
                        );
                      }
                      return <p className="text-slate-800 font-normal">{qa.answer}</p>;
                    })()}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 7. SECTION 6: AGENDA DES ÉVÉNEMENTS */}
      <section id="agenda" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto bg-[#fcf9f8] border-b border-slate-200/60">
        
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <p className="font-mono text-[#006685] font-extrabold tracking-widest uppercase mb-3 text-xs md:text-sm flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006685] translate-y-[1px] shrink-0"></span>
            Agenda des rencontres
          </p>
          <h2 className="headline text-4xl md:text-5xl lg:text-6xl text-slate-950 font-black tracking-tight uppercase leading-none mb-8">
            Événements à ne pas manquer
          </h2>

          {/* Featured Apéros IA Spotlight Banner */}
          <div className="bg-slate-950 rounded-3xl p-6 md:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-highlighter/20 via-[#006685]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                <div className="relative shrink-0">
                  <img 
                    src={ninkasiLogoImg} 
                    alt="Ninkasi Brasserie" 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-highlighter shadow-xl bg-white p-0.5"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-2 -right-2 bg-highlighter text-slate-950 p-1.5 rounded-full shadow-md">
                    <Sparkles size={16} />
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="px-3 py-1 bg-highlighter text-slate-950 text-xs font-mono font-black uppercase rounded-full tracking-wider">
                      🤖 LE RENDEZ-VOUS IA RÉCURRENT
                    </span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-mono font-bold uppercase rounded-full border border-slate-700 flex items-center gap-1">
                      <MapPin size={12} className="text-highlighter" /> Brasserie Ninkasi Besançon
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight">
                    Les Apéros IA <span className="text-highlighter font-light">Silicon Comté</span>
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base font-light mt-2 max-w-2xl leading-relaxed">
                    {content.agendaIntro}
                  </p>
                </div>
              </div>

              <div className="shrink-0 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl text-center w-full lg:w-auto min-w-[210px] shadow-inner">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block mb-1">
                  PÉRIODICITÉ RÉGULIÈRE
                </span>
                <span className="text-highlighter font-extrabold text-base md:text-lg block">
                  Chaque 2<sup>ème</sup> Mardi
                </span>
                <span className="text-slate-300 text-xs block mt-1 font-medium">
                  18h30 • Ambiance Conviviale
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-12">
           {/* Horizontal Timeline Connector Bar */}
           <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-[3px] bg-slate-200/90 z-0"></div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
             {content.agendaEvents.map((ev, idx) => {
               const parts = ev.date.split(' ');
               const day = parts[0] || '';
               const month = parts.slice(1).join(' ') || '';

               return (
                 <motion.div 
                   key={idx}
                   {...fadeInUp}
                   className="flex flex-col items-center group relative"
                 >
                    {/* Date Header Node */}
                    <div className="mb-6 flex flex-col items-center relative z-10 w-full">
                      {/* Node Circle Badge holding the day number */}
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-300 group-hover:border-[#006685] group-hover:bg-[#006685] transition-all duration-300 shadow-md flex items-center justify-center mb-3 group-hover:scale-105">
                        <span className="font-display font-black text-2xl text-slate-900 group-hover:text-highlighter transition-colors leading-none">
                          {day}
                        </span>
                      </div>
                      
                      {/* Month Badge */}
                      <span className="font-mono text-[11px] font-extrabold text-[#006685] tracking-widest uppercase bg-slate-100/90 px-3.5 py-1 rounded-full border border-slate-200/80 shadow-sm">
                        {month}
                      </span>
                    </div>

                    {/* Description Card */}
                    <div className={`w-full ${isGenerating ? 'bg-white' : 'backdrop-blur-md bg-white'} border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-3xl p-6 hover:shadow-[0_20px_45px_rgba(0,102,133,0.12)] hover:border-[#006685]/50 transition-all duration-300 flex-1 flex flex-col justify-between group-hover:-translate-y-1`}>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="h-6 inline-flex items-center justify-center text-[10px] font-mono font-bold tracking-widest uppercase bg-slate-950 text-highlighter px-3 py-0 rounded-full shadow-sm leading-none border border-slate-800">
                            APÉRO IA #{idx + 2}
                          </span>
                          <span className="text-slate-400">
                            <Brain size={16} />
                          </span>
                        </div>
                        <h3 className="text-base font-display font-black mb-3 text-slate-950 leading-snug uppercase group-hover:text-[#006685] transition-colors text-center lg:text-left">
                          {ev.title}
                        </h3>
                        <p className="text-slate-600 font-light text-xs leading-relaxed text-center lg:text-left">
                          {ev.desc}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#006685]">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> Ninkasi
                        </span>
                        <span className="font-mono text-slate-400">18h30</span>
                      </div>
                    </div>
                 </motion.div>
               );
             })}
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
                // CRÉATEURS DE VALEUR // 
              </p>
              <h2 className="headline text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 mb-3 tracking-tight uppercase leading-none">
                Pourquoi nous rejoindre&nbsp;?
              </h2>
              <p className="text-lg md:text-xl font-light text-slate-550 mb-12 max-w-xl">
                Bénéficiez immédiatement de retombées directes sur votre visibilité, votre réputation et votre croissance régionale.
              </p>
            </motion.div>

            <div className="space-y-8">
              {[ 
                { num: '01', title: 'Badge Adhérent exclusif', desc: 'Sceau numérique officiel de labellisation à intégrer sur votre site et vos communications pour affirmer votre ancrage.' },
                { num: '02', title: 'Référencement (backlinks) dans l\'annuaire', desc: 'Boostez votre SEO technique grâce à un lien web certifié provenant du site officiel Silicon Comté, indexé pour rassurer vos prospects.' },
                { num: '03', title: 'Accueillir un Digital Apéro', desc: 'Une occasion unique de recevoir l\'ensemble de l\'écosystème numérique réunissant plus de 40 décideurs dans vos propres locaux.' },
                { num: '04', title: 'Pot de Rentrée réservé', desc: 'Accès exclusif et privé à nos grands rassemblements informels de networking de début de saison pour nouer des liens solides.' },
                { num: '05', title: 'Interview & Visibilité Exclusive', desc: 'Mettez en avant votre expertise, votre parcours et votre entreprise grâce à un entretien dédié, à l\'image de celui ci-après, publié dans de futures newsletters.' }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  {...fadeInUp} 
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
            </div>
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
                  <div className="absolute inset-0 opacity-20 bg-cover mix-blend-overlay" style={{ backgroundImage: `url(${illustrationHome})` }}></div>
                  <span className={`h-8 inline-flex items-center justify-center font-display font-extrabold uppercase tracking-widest text-[#006685] text-[11px] relative z-10 ${isGenerating ? 'bg-white' : 'bg-white/40 backdrop-blur-md'} px-5 rounded-full border border-white/40 leading-none`}>
                    Sceau Adhérent 2026/2027
                  </span>
                </div>
                
                {/* Badge Main Body */}
                <div className="flex-1 p-8 text-center flex flex-col justify-between relative bg-gradient-to-b from-white to-slate-50/50">
                   {/* Logo vector embedded subtle */}
                   <div className="absolute inset-x-8 inset-y-16 opacity-[0.035] bg-center bg-no-repeat bg-contain pointer-events-none" style={{ backgroundImage: `url(${logoSiliconComte})` }}></div>
                   
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
                       src={logoSiliconComte} 
                       alt="Certification" 
                       className="w-[70px] opacity-25 filter grayscale contrast-125" 
                     />
                   </div>
                </div>
             </motion.div>
          </div>

        </div>
      </section>

      {/* 8. FOOTER WITH REFIND OUTLINES AND BRAND INTEGRATIONS */}
      <footer className="bg-slate-950 pt-24 pb-16 px-6 md:px-12 relative overflow-hidden text-white border-t-[12px] border-highlighter">
        <div className="absolute inset-0 z-0 opacity-[0.035] bg-cover bg-center bg-no-repeat mix-blend-luminosity" style={{ backgroundImage: `url(${illustrationHome})` }}></div>
        
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

      {/* 9. SIDE PANEL DRAWER FOR EXPORT CONTROLS */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              data-html2canvas-ignore="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] cursor-pointer"
            />

            {/* Sidebar Panel */}
            <motion.div
              data-html2canvas-ignore="true"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-800 text-white z-[110] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div>
                  <span className="font-mono text-highlighter text-[9px] uppercase tracking-widest font-extrabold bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 shadow-sm inline-block mb-1.5">
                    // ARCHIVAGE OPTIMISÉ
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight uppercase font-display text-white">
                    Options d'Édition
                  </h3>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 active:scale-95 transition-all cursor-pointer"
                  title="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                    ARCHIVAGE & EXPORT
                  </h4>
                  <p className="text-slate-400 font-light text-xs leading-relaxed mb-6">
                    Téléchargez cette édition au format PDF haute fidélité. Le document généré s'ajustera automatiquement à la largeur du layout sans aucune coupure de page, idéal pour une impression propre ou une lecture déconnectée.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* PDF Download Button */}
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await new Promise((resolve) => setTimeout(resolve, 300));
                      generatePDF();
                    }}
                    disabled={isGenerating}
                    className={`w-full px-6 py-4 rounded-xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-3 shadow-lg border transition-all duration-300 ${
                      isGenerating 
                        ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-highlighter border-highlighter text-slate-950 hover:bg-yellow-400 hover:shadow-[0_10px_20px_rgba(251,216,0,0.2)] active:scale-95 cursor-pointer'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        GÉNÉRATION DU PDF...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 text-slate-950" />
                        TÉLÉCHARGER LE PDF
                      </>
                    )}
                  </button>

                  {/* HTML Email Export Button */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      generateHtmlEmail();
                    }}
                    className="w-full px-6 py-4 rounded-xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:shadow-[0_10px_20px_rgba(251,216,0,0.05)] active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-highlighter" />
                    EXPORTER EN HTML (EMAIL)
                  </button>

                  {/* Markdown Text Download Button */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      generateMarkdown();
                    }}
                    className="w-full px-6 py-4 rounded-xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:shadow-[0_10px_20px_rgba(251,216,0,0.05)] active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-highlighter" />
                    TÉLÉCHARGER LE TEXTE (MD)
                  </button>

                  {/* Future Archive (IA) Toggle Button */}
                  <button
                    onClick={() => {
                      toggleFutureMaterial();
                    }}
                    className="w-full px-6 py-4 rounded-xl font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-highlighter/50 hover:shadow-[0_10px_20px_rgba(251,216,0,0.05)] active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    {showFutureMaterial ? (
                      <>
                        <EyeOff className="w-4 h-4 text-highlighter" />
                        <span>MASQUER L'ARCHIVE (IA)</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-highlighter" />
                        <span>AFFICHER L'ARCHIVE (IA)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-highlighter" /> Éditions Précédentes
                  </h4>
                  <p className="text-slate-400 font-light text-xs leading-relaxed mb-4">
                    Parcourez les éditions sauvegardées ou créez un nouveau bulletin basé sur le précédent.
                  </p>
                  
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {editions.map((ed) => {
                      const isActive = ed.id === activeEdition.id;
                      return (
                        <button
                          key={ed.id}
                          onClick={() => setActiveEdition(ed)}
                          className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between border transition-all cursor-pointer group ${
                            isActive
                              ? 'bg-[#006685]/10 border-[#006685] text-white font-semibold'
                              : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-display uppercase tracking-wider group-hover:text-highlighter transition-colors">
                              Édition N°{ed.editionNumber}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {ed.date}
                            </span>
                          </div>
                          {isActive && (
                            <Check className="w-4 h-4 text-highlighter shrink-0 animate-scale-in" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={createNewEdition}
                    className="w-full mt-4 px-4 py-3.5 rounded-xl border border-dashed border-slate-700 hover:border-highlighter/60 bg-transparent text-highlighter hover:text-white hover:bg-slate-800/50 flex items-center justify-center gap-2 text-xs font-bold font-display uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Créer une nouvelle lettre
                  </button>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-950/50 space-y-4 shrink-0">
                <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">
                  <span>SILICON COMTÉ © 2026</span>
                  <span className="text-[#006685] bg-[#006685]/10 px-2 py-0.5 rounded border border-[#006685]/20">
                    {referenceNumber}
                  </span>
                </div>
                <div className="text-[9px] text-slate-600 leading-normal text-center">
                  Assurez-vous que les polices Space Grotesk et Inter soient chargées pour un rendu vectoriel optimal.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
