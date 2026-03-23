"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronLeft, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Service {
  id: string;
  label: string;
  timeLimit: string;
  bagLabel: string;
  description: string;
  bagContents: string[];
  steps: string[];
  proTips?: string[];
}

const SERVICES: Service[] = [
  {
    id: "pre-exam",
    label: "Pre-Exam Setup & Disinfection",
    timeLimit: "10 min",
    bagLabel: "Pre-Exam Setup & Disinfection",
    description:
      "The first bag you open when the exam begins. Sanitize your station, set up your tools, position your mannequin, and prepare for the services ahead.",
    bagContents: [
      "Paper Towels -- full roll inside a bag labeled \"Paper Towels\"",
      "Trash Bag -- heavy-duty bag labeled \"Trash Bag\"",
      "Heavy-Duty Tape -- one roll to secure the trash bag",
      "EPA Disinfectant Spray -- closed, labeled \"EPA\"",
      "Water Bottle -- tightly closed, labeled \"Water\"",
      "Hand Sanitizer -- bottle labeled \"Hand Sanitizer\"",
      "First-Aid Kit container with: roll of gauze, alcohol wipes, Band-Aids, disposable gloves",
    ],
    steps: [
      "Sanitize your hands -- as soon as you're told to begin, sanitize thoroughly.",
      "Set up tripod or clamp -- position securely at your assigned station.",
      "Remove mannequin head & pre-sanitized implements bag; immediately close your large kit bag to avoid point loss.",
      "Secure mannequin on tripod -- make sure it is tightly fastened.",
      "Pull out EPA disinfectant & paper towels -- ensure the bottle is labeled.",
      "Spray & wipe down all work surfaces -- large haircutting station, small manicure table, both chairs.",
      "Place & secure your trash bag -- use a large trash bag labeled \"Trash Bag\"; staple or tape inside a foldable hamper; ensure it touches the floor.",
      "Neatly place labeled items on station -- hand sanitizer, water bottle, blood spill kit (labeled), tape.",
      "Discard used paper towels in trash.",
      "Sanitize your hands again -- always sanitize after handling trash or setup items.",
      "Stand back & raise your hand -- signal to the examiner that you're finished.",
    ],
    proTips: [
      "Pre-tape a trash bag inside a pop-up hamper labeled \"TRASH.\" Collapse and pack it -- on exam day, just pop it open, ready to use.",
    ],
  },
  {
    id: "manicure",
    label: "Manicure Service",
    timeLimit: "22 min",
    bagLabel: "Manicure Service",
    description:
      "Perform a basic manicure on five nails of a mannequin hand, following all sanitation and safety protocols.",
    bagContents: [
      "2½-gallon Zip-Seal Bag -- label one side \"Manicure Service,\" label the other side \"Trash\"",
      "Towels (×3) -- any color, white not required",
      "Mannequin Hand -- pre-tipped with shaped and filed nail tips; no labels, markings, or names",
      "Finger Bowl & Soappy Water -- finger bowl + small container labeled \"Soappy Water\"",
      "Cuticle Products -- container labeled \"Cuticle Oil\" + container labeled \"Cuticle Remover\"",
      "Sanitized Implements (labeled container) -- cotton rounds, nail file, nail buffer, nail brush, wooden pusher(s), wooden cotton-tip swab",
    ],
    steps: [
      "Sanitize & prepare kit -- sanitize hands; open large kit bag, remove Manicure Service bag; close large kit bag immediately.",
      "Set up supplies -- lay out: Sanitized Implements box, mannequin hand, finger bowl, towels, soapy water, cuticle oil, cuticle remover, small trash bag, tape.",
      "Secure trash bag -- tape the small trash bag to the manicure table using multiple strips; sanitize hands.",
      "Create workspace bump -- fold one towel, then fold a second towel over it to form a support bump; place bump under the mannequin hand.",
      "Hand & nail analysis -- sanitize hands and mannequin hand; perform a quick hand and nail analysis.",
      "Shape nails -- sanitize hands; remove nail file from Sanitized Implements; shape each of the five nails (round, square, or point); discard file; sanitize hands.",
      "Soften cuticles -- pour soapy water into finger bowl; soak fingers 1 minute; close and discard soapy water container; sanitize hands.",
      "Clean nails -- use nail brush over the finger bowl to clean debris from all nails; discard brush; sanitize hands.",
      "Dry & apply cuticle remover -- use extra towel to dry hand; sanitize hands; apply a small drop of cuticle remover at each cuticle; close remover; sanitize hands.",
      "Push back cuticles -- use wooden pusher to gently push back cuticles on all five nails; wipe pusher on towel; snap in half; discard; sanitize hands.",
      "Clean under free edge -- take cotton-tipped wooden stick from sanitized implements; clean under each nail's free edge; snap stick in half; discard; sanitize hands.",
      "Buff nails -- use nail buffer on each nail (side-to-side, top-to-bottom motions); discard buffer; sanitize hands.",
      "Apply cuticle oil -- apply one drop of cuticle oil to each nail; close oil; sanitize hands.",
      "Remove excess oil -- wipe off excess oil with a cotton round; remove any lint; discard cotton round and leftover supplies; sanitize hands.",
      "Clean up & disinfect -- absorb finger bowl water with towels; discard towels; sanitize hands; disinfect station with EPA spray + paper towels; discard all waste.",
      "Signal completion -- place finished mannequin hand on table; raise your hand to notify the examiner.",
    ],
    proTips: [
      "Pack liquids upright in leak-proof containers, wrap sharp tools for safety, use small sub-bags for organization, and leave extra space for easy grab-and-go on exam day.",
    ],
  },
  {
    id: "shave",
    label: "Professional Shave Service",
    timeLimit: "42 min",
    bagLabel: "Professional Shave Service",
    description:
      "Apply lather and towels, then demonstrate proper razor stroke techniques on a mannequin.",
    bagContents: [
      "Towels (×6) -- six towels; extras optional but not required",
      "Cape",
      "Razor -- no blade required for mannequin",
      "Headrest Cover -- processing cap to cover the chair headrest",
      "Astringent / Aftershave -- bottle labeled \"Astringent\" or \"Aftershave,\" tightly closed",
      "Shaving Cream -- container labeled \"Shaving Cream\"",
    ],
    steps: [
      "Sanitize & prepare kit -- sanitize hands; open large kit bag, remove Professional Shave Service bag; close large kit bag immediately.",
      "Drape the mannequin -- sanitize hands; place first towel snugly around neck, tuck edges; drape cape over towel, tie securely; add second towel over cape, adjust to expose neck; apply headrest cover.",
      "Steam & prep skin -- sanitize hands; wet towel under hot water, wring out excess; test temp below nose with fingertip; drape hot towel over beard area for 2 minutes, massaging gently; remove in one smooth circular motion; discard towel; sanitize hands.",
      "Lather & repeat -- apply shaving cream to back of hand, spread onto beard area, massage in direction of hair growth; sanitize hands; repeat hot towel process (hot, test, massage, remove); sanitize hands.",
      "Demonstrate shaving strokes -- sanitize hands; hold closed razor up to signal examiner; on instruction, demonstrate: freehand stroke (stretch skin, smooth pass, wipe razor), backhand stroke, reverse freehand stroke.",
      "Complete the shave -- sanitize hands; perform strokes 1–14 in order, wiping razor between each; discard razor cover; sanitize hands.",
      "Cold towel & pore close -- wet towel under cold water, wring out; test temp; drape over shaved area, press for 2 minutes; remove in one motion; discard towel; sanitize hands.",
      "Apply aftershave -- sanitize hands; spray/apply astringent to towel or paper towel (do not rub); pat into shaved areas to close pores; discard towel/astringent; sanitize hands.",
      "Clean up & disinfect -- disinfect station + chair with EPA spray and towel; discard towel; remove all waste except drape towels + headrest cover (leave draping intact); sanitize hands.",
      "Signal completion -- raise your hand to notify the examiner.",
    ],
    proTips: [
      "Roll towels tightly and stack vertically for extra space.",
      "Use small, labeled travel bottles for shaving cream and aftershave.",
      "Wrap the razor in a padded sleeve or towel for protection.",
      "Fold cape and headrest cover flat at the back for easy access.",
      "Place paper towels and gloves in a sub-bag to keep them dry and organized.",
    ],
  },
  {
    id: "blood-exposure",
    label: "Blood Exposure Incident",
    timeLimit: "12 min",
    bagLabel: "Blood Exposure Incident",
    description:
      "Demonstrate proper cleanup, sanitation, and bandaging procedures for a simulated blood spill. You'll be notified at 6 minutes remaining.",
    bagContents: [
      "Small Ziploc labeled \"Biohazard\"",
      "Small Ziploc labeled \"Trash\"",
      "Small Ziploc labeled \"Pre-Sanitized\" or \"Disinfected\" containing:",
      "  -- Pair of gloves",
      "  -- Cotton rounds (at least one; extras recommended)",
      "  -- Band-Aids (at least one)",
      "  -- Alcohol swab (at least one)",
      "  -- Cotton (at least one)",
      "  -- Nick relief / styptic powder (securely closed)",
    ],
    steps: [
      "Sanitize & remove towel -- sanitize hands; if a wiping towel is still on your station, remove and discard it; sanitize hands again.",
      "Retrieve kits & set up bags -- open large kit bag, remove Blood Exposure Incident Service bag; close kit bag immediately; lay out: gloves, biohazard bag, trash bag, alcohol swab, styptic powder, Q-tip, cotton rounds (2), Band-Aid.",
      "Don & sanitize gloves -- put on gloves (ensure proper fit); sanitize gloved hands.",
      "Apply pressure & cleanse -- wet one cotton round from water bottle; apply pressure to simulated cut for 15 seconds; discard used cotton round into biohazard bag; sanitize gloves; open alcohol swab; cleanse the cut thoroughly; discard swab + wrapper into biohazard bag; sanitize gloves.",
      "Apply styptic powder -- sprinkle a small amount of styptic powder onto a Q-tip using a cotton round; apply powder to the cut; discard used cotton round + Q-tip; sanitize gloves.",
      "Apply Band-Aid -- sanitize gloves; open Band-Aid without touching the pad; apply over the cut carefully; discard Band-Aid wrapper into biohazard bag; sanitize gloves.",
      "Double-bag & dispose -- place all biohazard items (gloves, swabs, pads) into the biohazard bag; close biohazard bag; place it into the labeled trash bag; ensure the biohazard label is visible; discard into the exam trash.",
      "Clean up station -- EPA-disinfect your station surface; discard disinfectant wipe; sanitize hands.",
      "Signal completion -- ensure station is neat and Band-Aid is correctly applied; raise your hand to notify the examiner.",
    ],
    proTips: [
      "Separate small items in mini bags or pillboxes.",
      "Keep biohazard bag on top for quick access.",
      "Pre-fill styptic to avoid spills.",
      "Pack only essentials -- skip bulky kits.",
      "Flatten gloves between paper towels to save space.",
    ],
  },
  {
    id: "facial",
    label: "Facial Service",
    timeLimit: "17 min",
    bagLabel: "Facial Service",
    description:
      "Cleanse, massage, tone, and moisturize your mannequin following sanitation protocols.",
    bagContents: [
      "Towels (×2)",
      "Cape or Drape",
      "Processing Cap (Shower Cap)",
      "Headband",
      "Facial Products (all labeled and tightly closed) -- Cleanser, Massage Cream, Moisturizing Lotion, Toner",
      "Small Ziploc labeled \"Sanitized Implements\" -- at least 3 spatulas, at least 8 cotton rounds (extras recommended)",
    ],
    steps: [
      "Sanitize & prep -- sanitize hands; open large kit bag, remove Facial Service bag; close kit bag immediately.",
      "Redrape station -- discard previous drape + Band-Aid; sanitize hands; wrap one towel snugly around mannequin's neck, tuck and secure; drape cape over towel (no skin contact), tie snugly; add second towel over cape, adjust to expose face; apply headband + shower cap over hairline; recline and lock mannequin.",
      "Cleanse skin -- sanitize hands; take spatula + facial cleanser; dispense cleanser onto back of hand; apply dots to chin, nose, forehead, cheeks; spread with gentle strokes, then use circular motions to cleanse.",
      "Remove cleanser -- sanitize hands; moisten two cotton rounds with water; remove cleanser using center-out strokes; discard cotton rounds; sanitize hands.",
      "Massage manipulation -- sanitize hands; dispense massage cream with spatula; apply; perform one massage technique (3 circles each): Petrissage (pinch + roll), Effleurage (sliding upward pressure), or Tapotement (tapping); wipe hands on towel; sanitize hands.",
      "Remove massage cream -- sanitize hands; moisten two cotton rounds; remove cream using center-out strokes; discard rounds; sanitize hands.",
      "Tone skin -- sanitize hands; apply toner with a cotton round or spray and pat over the face; discard and sanitize hands.",
      "Moisturize -- sanitize hands; dispense small amount of moisturizer with spatula onto back of hand; spread using upward motions until absorbed; discard spatula; sanitize hands.",
      "Clean up & disinfect -- discard all used items and trash; disinfect station with EPA spray and towel; discard towel; sanitize hands.",
      "Signal completion -- ensure station is neat and face is product-free; raise your hand to notify the examiner.",
    ],
    proTips: [
      "Use leak-proof, labeled travel containers for creams and lotions.",
      "Stack cotton rounds and spatulas in a small zip bag.",
      "Roll towels tightly; place flat items like the cap at the back.",
      "Group facial products in a sub-bag for easy access.",
      "Use slim mist or pump bottles for toner and moisturizer to save space.",
    ],
  },
  {
    id: "haircut",
    label: "Haircutting Service",
    timeLimit: "37 min",
    bagLabel: "Haircutting Service",
    description:
      "Perform shears and clipper work, arching, and blending. Must demonstrate cutting at least 1 inch of hair.",
    bagContents: [
      "2 Neck strips",
      "Cutting cape",
      "Shears",
      "Clippers (with guard attached)",
      "Haircutting comb",
      "Set of hair clips (4 or more)",
      "Spray bottle of water (labeled \"Water\")",
      "Towel (for dampening and cleanup)",
      "Small trash bag (labeled \"Trash Bag\")",
      "Heavy-duty tape (for securing drape)",
      "Hand sanitizer (labeled)",
      "EPA disinfectant spray (labeled)",
    ],
    steps: [
      "Sanitize & prep -- sanitize hands; open kit bag, remove Hair Cutting Service bag; close kit bag immediately.",
      "Drape & redrape -- discard previous drape; sanitize hands; place neck strip snugly, tuck under; drape cape over neck strip (no skin contact), tuck and secure; roll a second neck strip over the cape to seal.",
      "Hair & scalp analysis -- sanitize hands; comb through hair; inspect scalp and hair for irregularities.",
      "Clip nape & back -- sanitize hands; freehand clip 1\" off the nape area, side to side; clip over comb up from nape to occipital ridge as a guideline; sanitize hands.",
      "Clip sides -- sanitize hands; clip over comb from sideburn to parietal ridge on each side; ensure symmetry; adjust guide as needed.",
      "Shear cutting -- sanitize hands; saturate hair with water, comb through; establish central guideline at crown (3-finger depth); cut 1\" sections with shears, following the guideline; blend perimeter (point cut bangs if desired).",
      "Detailing with trimmers -- sanitize hands; use trimmers to arch around ears and neckline, staying on the perimeter.",
      "Blend with shear over comb -- sanitize hands; comb hair down; use shears over comb to smooth uneven areas.",
      "Style & clean floor -- sanitize hands; comb hair into desired style (e.g., comb-over); use a clean towel or sweeper to remove loose hair from mannequin + station; sweep floor completely; discard hair in provided receptacle.",
      "Final cleanup & disinfect -- discard all tools except one comb for examiner review; disinfect station + chair with EPA spray; discard wipe; sanitize hands.",
      "Signal completion -- ensure station is neat, drape intact, and hair-free; raise your hand to notify the examiner.",
    ],
    proTips: [
      "Wrap shears, clippers, and trimmers in a towel or tool roll to prevent damage.",
      "Label or tie cords neatly; fold the cape and towel flat at the back.",
      "Place the comb and neck strip on top for fast access.",
      "Fully charge and test all cordless tools the night before.",
    ],
  },
  {
    id: "blow-dry",
    label: "Blow-Drying & Thermal Curling",
    timeLimit: "22 min",
    bagLabel: "Blow-Drying & Thermal Curling",
    description:
      "Blow-dry a section and create one curl using a curling iron set above 400°F.",
    bagContents: [
      "2 towels (for draping and tool wrapping)",
      "Cutting cape",
      "Rat-tail comb",
      "Hair brush (paddle or styling brush)",
      "Round roller brush",
      "Blow dryer",
      "Curling iron (spring-loaded or Marcel)",
      "3rd towel (for wrapping tools)",
      "4 hair clips",
      "1 butterfly clip",
      "1 neck strip",
    ],
    steps: [
      "Sanitize & prep -- sanitize hands; discard previous drape (if present); sanitize hands again.",
      "Retrieve kit & mannequin -- open kit bag; remove long-haired mannequin + service bag; place mannequin on stand; close kit bag; sanitize hands; empty service bag onto station; discard the bag.",
      "Power & heat tools -- plug in blow dryer + curling iron; set curling iron above 400°F; check red light indicator; tuck cords neatly; sanitize hands.",
      "Drape mannequin -- wrap towel around mannequin's neck, tuck + secure; place second towel or cape over first, secure (no skin contact); clip excess hair away from face; sanitize hands.",
      "Section hair -- use rat-tail comb to part center (nape to forehead); clip half away; from apex to ear, create three subsections; clip two, leave one down; wet section as desired; sanitize hands.",
      "Blow drying technique -- select bottom subsection; brush through while directing hot air roots-to-ends; once ends are dry, cool with dryer; roll brush to form curl, release + set; continue with remaining subsections, working bottom-up.",
      "Thermal curling -- sanitize hands; test curling iron on protective strip, check curl, avoid burning; measure 1\" subsection; comb smooth; clamp + roll onto iron; hold ~20 seconds; gently release + cool (don't drop curl); discard strip.",
      "Clean up & tool care -- unplug + wrap dryer + curling iron (use towel if hot); discard used towels, clips, + strips; sanitize hands.",
      "Final cleanup & disinfect -- disinfect station + chair with EPA spray; discard wipe; sanitize hands; ensure station is neat + hair-free.",
      "Signal completion -- raise your hand to notify the examiner.",
    ],
    proTips: [
      "Use cord wraps for neat cords.",
      "Pack small items in a labeled pouch.",
      "Wrap curling iron in a heat-safe towel.",
      "Fold towels flat with cap at the bottom.",
      "Stand the round brush upright.",
      "Test all tools ahead of exam day for safety.",
    ],
  },
  {
    id: "chem-prep",
    label: "Chemical Application Preparation",
    timeLimit: "Bag prep only",
    bagLabel: "Chemical Application Preparation",
    description:
      "Prepare and pack the Chemical Application bag. This bag supports chemical services during the exam.",
    bagContents: [
      "2 towels (any color)",
      "Protective cap",
      "Protective cream (labeled \"Protective Cream\" -- e.g., Vaseline)",
      "Small Ziploc labeled \"Sanitized Implements\" containing: at least 1 spatula, 1 pair of gloves",
    ],
    steps: [
      "Use a 2½-gallon zip-seal bag labeled \"Chemical Application Preparation.\"",
      "Place all items neatly into the labeled bag.",
      "Squeeze out excess air to keep the bag compact.",
      "Fully seal the zipper to ensure a tight closure.",
    ],
    proTips: [
      "Label the protective cream clearly -- examiners check every container.",
      "Pre-stack gloves flat inside the Sanitized Implements bag.",
    ],
  },
  {
    id: "perm",
    label: "Permanent Wave Service",
    timeLimit: "20 min",
    bagLabel: "Permanent Wave Service",
    description:
      "Wrap rods, apply mock solution, and perform a drip test demonstrating proper technique.",
    bagContents: [
      "2 towels (any color)",
      "Cape (any color)",
      "Small Ziploc labeled \"Disinfected\" containing: at least 4 perm rods (extras recommended), handful of perm papers, 1 pair of gloves",
      "Perm solution container (filled with water for practice; tightly closed)",
    ],
    steps: [
      "Sanitize & prep -- sanitize hands; open large kit bag, remove Permanent Wave Service bag; close kit bag immediately.",
      "Retrieve supplies & drape -- empty service bag contents onto station; discard the bag; discard previous drape if needed; sanitize hands; drape mannequin with towel + cape.",
      "Section & measure -- sanitize hands; release side clips; create a straight-line section at the back of the head; measure subsections by rod length + width; clip excess hair away.",
      "Wrap rods (4 minimum) -- sanitize hands; choose wrapping method (single flat, double flat, or bookend); place end paper, align hair ends, roll rod with moderate tension; secure rod with elastic band at the start of the curl; repeat for all four rods, keeping consistent elevation (on-base, half-, or off-base).",
      "Protect & prepare -- wrap cotton around each rod to catch drips; adjust mannequin tilt if needed.",
      "Apply perm solution -- sanitize hands + put on gloves; hold solution bottle in a 'Z' pattern; saturate each rod thoroughly; close solution + set aside.",
      "Demonstrate test curl -- hold towel under one rod; unwrap partially to show curl formation; if requested, unwrap end paper to show hair ends are wrapped correctly.",
      "Clean up & disinfect -- discard end papers + excess cotton; sanitize hands; disinfect station with EPA spray; discard wipe + any dropped items; sanitize hands.",
      "Signal completion -- ensure station is tidy + no papers or cotton on the floor; raise your hand to notify the examiner.",
    ],
    proTips: [
      "Keep perm rods and end papers in a mini pouch.",
      "Pre-roll cotton and secure it.",
      "Fill mock perm solution with gel or water.",
      "Cushion fragile items with a towel.",
      "Store gloves flat between towels or in a side pouch.",
      "Place comb and clips on top for easy access.",
    ],
  },
  {
    id: "color",
    label: "Single Color Retouch",
    timeLimit: "22 min",
    bagLabel: "Single Color Retouch",
    description:
      "Simulate applying color to 1 inch of new growth in one quadrant, including a patch test and strand test.",
    bagContents: [
      "2 towels (any color)",
      "1 set of gloves",
      "1 foil sheet",
      "At least 1 Q-tip",
      "Color bowl",
      "Color brush",
      "Mock hair color (labeled \"Hair Color\"; tightly closed -- e.g., hair gel or similar)",
    ],
    steps: [
      "Sanitize & prep -- sanitize hands; open large kit bag, remove Single Color Retouch Service bag; close kit bag immediately.",
      "Retrieve supplies & drape -- empty service bag contents onto station; discard the bag; sanitize hands; prepare two towels (one for drape, one for patch test).",
      "Patch & strand test -- sanitize hands; prepare color in the bowl; close container; perform patch test behind ear with Q-tip; discard Q-tip; unpin hair; select 1\" strand at occipital bone for strand test; apply color to strand; seal in foil; wet towel; check patch test for redness + check strand color on white towel; discard foil + towel; sanitize hands.",
      "Section & apply color -- sanitize hands; divide hair into four subsections (¼\"–½\" wide); for each subsection: apply color 1\" from scalp on both sides of part; avoid overlapping onto previously colored hair; lay subsection down neatly.",
      "Confirm separation -- sanitize hands; bend each colored subsection over a brush to show clear 1\" regrowth separation.",
      "Clean up & disinfect -- discard all used items + trash; sanitize hands.",
      "Signal completion -- ensure clean drape + clear separation on mannequin; raise your hand to notify the examiner.",
    ],
    proTips: [
      "Use a small squeeze bottle for mock color.",
      "Pack bowl and brush in a sub-bag.",
      "Lay gloves flat by the towel.",
      "Keep clips and comb on top for quick access.",
    ],
  },
];

interface ProgressEntry {
  serviceId: string;
  practicedCount: number;
  lastPracticedAt: number;
}

function ServiceCard({
  service,
  progress,
  onMarkPracticed,
  onResetProgress,
}: {
  service: Service;
  progress: ProgressEntry | undefined;
  onMarkPracticed: () => void;
  onResetProgress: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const allChecked = service.bagContents.length > 0 && checkedItems.size === service.bagContents.length;
  const isTimedService = !service.timeLimit.toLowerCase().includes("only");

  const lastPracticedLabel = progress
    ? new Date(progress.lastPracticedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card className="overflow-hidden">
      {/* Header -- always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start justify-between gap-3 p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {isTimedService ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-muted-foreground">
                <Clock size={11} />
                {service.timeLimit}
              </span>
            ) : (
              <Badge variant="muted" className="text-xs">Bag prep only</Badge>
            )}
            {allChecked && (
              <span className="text-xs text-green-600 font-medium">Bag packed</span>
            )}
            {progress && (
              <span className="text-xs text-muted-foreground">
                Practiced {progress.practicedCount}x &middot; {lastPracticedLabel}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground leading-snug">
            {service.label}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {service.description}
          </p>
        </div>
        <div className="shrink-0 mt-0.5">
          {expanded ? (
            <ChevronUp size={18} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded body -- bag contents AND exam steps, both always visible */}
      {expanded && (
        <div className="border-t border-border divide-y divide-border">

          {/* Section 1: Bag Contents */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Bag Contents</p>
              <p className="text-xs font-mono text-muted-foreground">Label: &ldquo;{service.bagLabel}&rdquo;</p>
            </div>
            <div className="space-y-1.5">
              {service.bagContents.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`w-full flex items-start gap-3 text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                    checkedItems.has(idx)
                      ? "bg-muted/60 text-muted-foreground"
                      : "hover:bg-muted/30 text-foreground"
                  }`}
                >
                  <span className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center text-xs font-bold transition-colors ${
                    checkedItems.has(idx)
                      ? "bg-foreground border-foreground text-background"
                      : "border-border"
                  }`}>
                    {checkedItems.has(idx) ? "✓" : ""}
                  </span>
                  <span className={`leading-relaxed ${checkedItems.has(idx) ? "line-through" : ""}`}>{item}</span>
                </button>
              ))}
              {checkedItems.size > 0 && (
                <button
                  onClick={() => setCheckedItems(new Set())}
                  className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors pl-3"
                >
                  Reset checklist
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Exam Steps */}
          {service.steps.length > 0 && (
            <div className="p-5">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Exam Steps</p>
              <ol className="space-y-3">
                {service.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Section 3: Pro Tips (if any) */}
          {service.proTips && service.proTips.length > 0 && (
            <div className="p-5 bg-muted/30">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Pro Tips</p>
              <ul className="space-y-1.5">
                {service.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="shrink-0 mt-0.5">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 4: Practice tracking */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              {progress ? (
                <p className="text-sm text-foreground font-medium">
                  {progress.practicedCount === 1 ? "Practiced once" : `Practiced ${progress.practicedCount} times`}
                  <span className="text-muted-foreground font-normal"> &middot; last {lastPracticedLabel}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not practiced yet</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {progress && (
                <button
                  onClick={onResetProgress}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset
                </button>
              )}
              <button
                onClick={onMarkPracticed}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                Mark as Practiced
              </button>
            </div>
          </div>

        </div>
      )}
    </Card>
  );
}

export default function ExamGuidePage() {
  const progressRecords = useQuery(api.examProgress.getMyProgress) ?? [];
  const markPracticed = useMutation(api.examProgress.markPracticed);
  const resetProgress = useMutation(api.examProgress.resetProgress);

  const progressMap = Object.fromEntries(
    progressRecords.map((p) => [p.serviceId, p])
  );

  const practicedCount = progressRecords.length;
  const totalServices = SERVICES.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">TDLR Practical Exam Guide</h1>
          <p className="text-sm text-muted-foreground">Texas Class A Barber -- vol. 1 · Powered by FadeJunkie</p>
        </div>
      </div>

      {/* Time summary + progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Exam at a Glance</p>
          {practicedCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {practicedCount}/{totalServices} practiced
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SERVICES.filter((s) => !s.timeLimit.toLowerCase().includes("only")).map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg ${
                progressMap[s.id] ? "bg-foreground/5 border border-foreground/10" : "bg-muted/40"
              }`}
            >
              <span className="text-xs text-foreground truncate">{s.label}</span>
              <span className="text-xs font-mono font-medium text-muted-foreground shrink-0">
                {progressMap[s.id] ? `${progressMap[s.id].practicedCount}x` : s.timeLimit}
              </span>
            </div>
          ))}
        </div>
        {practicedCount > 0 && (
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all"
              style={{ width: `${(practicedCount / totalServices) * 100}%` }}
            />
          </div>
        )}
      </Card>

      {/* Service cards */}
      <div className="space-y-3">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            progress={progressMap[service.id]}
            onMarkPracticed={() => markPracticed({ serviceId: service.id })}
            onResetProgress={() => resetProgress({ serviceId: service.id })}
          />
        ))}
      </div>

      {/* End of exam */}
      <Card className="p-5 bg-muted">
        <h3 className="text-sm font-semibold text-foreground mb-1">End of Exam Disinfection</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          After completing Single Color Retouch, there is no special end-of-exam bag. Await the proctor's final nod, then: (1) Pack up -- return all tools to their labeled bags. (2) Disinfect -- wipe down your station, tools, and kit one last time. (3) Depart -- once everything is bagged and sanitized, exit the exam area.
        </p>
      </Card>

      <Card className="p-5 bg-muted">
        <h3 className="text-sm font-semibold text-foreground mb-1">Study with Flashcards</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Test your knowledge on time limits, bag requirements, and procedures with the TDLR Practical Exam flashcard deck.
        </p>
        <Link
          href="/tools/flashcards"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
        >
          Open Flashcards →
        </Link>
      </Card>
    </div>
  );
}
