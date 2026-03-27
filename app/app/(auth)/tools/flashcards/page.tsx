"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const LETTERS = ["A", "B", "C", "D"] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardsPage() {
  const decks = useQuery(api.flashcards.listDecks);
  const starredIds = useQuery(api.flashcards.getStarredCardIds) ?? [];
  const starCard = useMutation(api.flashcards.starCard);
  const unstarCard = useMutation(api.flashcards.unstarCard);

  const [selectedDeckId, setSelectedDeckId] = useState<Id<"flashcardDecks"> | "all">("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<Id<"flashcards">[]>([]);

  const deckCards = useQuery(
    api.flashcards.listCardsByDeck,
    selectedDeckId !== "all" ? { deckId: selectedDeckId } : "skip"
  );
  const allCards = useQuery(api.flashcards.listAllCards);

  const rawCards = selectedDeckId === "all" ? (allCards ?? []) : (deckCards ?? []);

  const topics = useMemo(() => {
    const set = new Set(rawCards.map((c) => c.topic));
    return Array.from(set).sort();
  }, [rawCards]);

  const starredSet = useMemo(() => new Set(starredIds), [starredIds]);

  const filteredCards = useMemo(() => {
    let cards = rawCards;
    if (selectedTopic !== "all") cards = cards.filter((c) => c.topic === selectedTopic);
    if (showStarredOnly) cards = cards.filter((c) => starredSet.has(c._id));
    if (shuffleOrder.length > 0) {
      const idSet = new Set(cards.map((c) => c._id));
      return shuffleOrder
        .filter((id) => idSet.has(id))
        .map((id) => cards.find((c) => c._id === id)!);
    }
    return cards;
  }, [rawCards, selectedTopic, showStarredOnly, starredSet, shuffleOrder]);

  const card = filteredCards[currentIndex] ?? null;

  const optionValue = (letter: string) =>
    (card as unknown as Record<string, string> | null)?.[`option${letter}`] ?? "";

  const handleDeckChange = (val: Id<"flashcardDecks"> | "all") => {
    setSelectedDeckId(val);
    setSelectedTopic("all");
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffleOrder([]);
  };

  const handleTopicChange = (val: string) => {
    setSelectedTopic(val);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffleOrder([]);
  };

  const handleShuffle = () => {
    if (filteredCards.length === 0) return;
    setShuffleOrder(shuffle(filteredCards.map((c) => c._id)));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const goNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  };

  const toggleStar = async () => {
    if (!card) return;
    if (starredSet.has(card._id)) {
      await unstarCard({ cardId: card._id });
    } else {
      await starCard({ cardId: card._id });
    }
  };

  const isLoading = decks === undefined || allCards === undefined;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Flashcards</h1>
          <p className="text-sm text-muted-foreground">Open play — flip at your own pace</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Deck selector */}
        <select
          value={selectedDeckId}
          onChange={(e) => handleDeckChange(e.target.value as Id<"flashcardDecks"> | "all")}
          className="text-sm border border-border rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All decks</option>
          {(decks ?? []).map((d) => (
            <option key={d._id} value={d._id}>{d.title}</option>
          ))}
        </select>

        {/* Topic selector */}
        <select
          value={selectedTopic}
          onChange={(e) => handleTopicChange(e.target.value)}
          className="text-sm border border-border rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Starred toggle */}
        <button
          onClick={() => { setShowStarredOnly((v) => !v); setCurrentIndex(0); setIsFlipped(false); }}
          className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
            showStarredOnly
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          ☆ Starred only
        </button>

        {/* Shuffle */}
        <button
          onClick={handleShuffle}
          disabled={filteredCards.length === 0}
          className="text-sm px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
        >
          ↺ Shuffle
        </button>
      </div>

      {/* Progress */}
      {!isLoading && filteredCards.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Q {currentIndex + 1} / {filteredCards.length}
        </p>
      )}

      {/* Card */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
        </div>
      ) : (decks ?? []).length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <p className="text-sm font-medium text-foreground">No flashcards loaded yet</p>
          <p className="text-xs text-muted-foreground">Run the seeder to import 300 Milady exam questions.</p>
        </Card>
      ) : card ? (
        <div className="space-y-4">
          {/* Flip card */}
          <div
            className="cursor-pointer select-none"
            style={{ perspective: "1200px", height: "260px" }}
            onClick={() => setIsFlipped((f) => !f)}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                <Card className="h-full p-6 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="muted" className="text-xs max-w-[200px] truncate">{card.topic}</Badge>
                    <span className="text-xs text-muted-foreground shrink-0">Tap to reveal</span>
                  </div>
                  <p className="text-base font-medium text-foreground leading-relaxed">{card.question}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground/40">
                    {LETTERS.filter((l) => optionValue(l)).map((l) => <span key={l}>{l}</span>)}
                  </div>
                </Card>
              </div>

              {/* Back */}
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <Card className="h-full p-6 flex flex-col justify-center gap-2 bg-foreground border-foreground">
                  {LETTERS.filter((l) => optionValue(l)).map((letter) => (
                    <div
                      key={letter}
                      className={`flex items-start gap-3 px-3 py-2 rounded-lg text-sm ${
                        letter === card.correctAnswer
                          ? "bg-white/20 text-white"
                          : "text-white/50"
                      }`}
                    >
                      <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold ${
                        letter === card.correctAnswer ? "bg-white text-foreground" : "bg-white/10 text-white/60"
                      }`}>
                        {letter}
                      </span>
                      <span className={letter === card.correctAnswer ? "font-medium" : ""}>{optionValue(letter)}</span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>

          {/* Nav + Star */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={goPrev} disabled={currentIndex === 0}>
              ← Prev
            </Button>
            <Button
              variant={starredSet.has(card._id) ? "default" : "outline"}
              size="sm"
              onClick={toggleStar}
            >
              {starredSet.has(card._id) ? "★ Starred" : "☆ Star"}
            </Button>
            <Button variant="outline" size="sm" onClick={goNext} disabled={currentIndex === filteredCards.length - 1}>
              Next →
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {showStarredOnly ? "No starred cards yet. Star some cards to see them here." : "No cards match your filters."}
          </p>
        </Card>
      )}
    </div>
  );
}
