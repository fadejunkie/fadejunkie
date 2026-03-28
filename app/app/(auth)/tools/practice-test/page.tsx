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
const QUESTION_COUNTS = [20, 50, 100, 150];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "test" | "results";

interface AnswerEntry {
  cardId: Id<"flashcards">;
  selectedAnswer?: string;
  isCorrect: boolean;
}

interface Results {
  score: number;
  total: number;
  percentage: number;
  answerEntries: AnswerEntry[];
  questions: ReturnType<typeof useQuery<typeof api.flashcards.listAllCards>>;
}

export default function PracticeTestPage() {
  const decks = useQuery(api.flashcards.listDecks);
  const allCards = useQuery(api.flashcards.listAllCards);
  const saveTestResult = useMutation(api.flashcards.saveTestResult);

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedDeckId, setSelectedDeckId] = useState<Id<"flashcardDecks"> | "all">("all");
  const [questionCount, setQuestionCount] = useState(20);
  const [testQuestions, setTestQuestions] = useState<NonNullable<typeof allCards>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Results | null>(null);
  const [showReview, setShowReview] = useState(false);

  const pastResults = useQuery(
    api.flashcards.getMyTestResults,
    selectedDeckId !== "all" ? { deckId: selectedDeckId } : {}
  );

  const poolCards = useMemo(() => {
    if (!allCards) return [];
    if (selectedDeckId === "all") return allCards;
    return allCards.filter((c) => c.deckId === selectedDeckId);
  }, [allCards, selectedDeckId]);

  const handleStartTest = () => {
    const pool = shuffle(poolCards).slice(0, Math.min(questionCount, poolCards.length));
    setTestQuestions(pool);
    setAnswers({});
    setFlagged(new Set());
    setResults(null);
    setShowReview(false);
    setPhase("test");
  };

  const handleSubmit = async () => {
    const entries: AnswerEntry[] = testQuestions.map((q) => ({
      cardId: q._id,
      selectedAnswer: answers[q._id] ?? undefined,
      isCorrect: answers[q._id] === q.correctAnswer,
    }));

    const score = entries.filter((e) => e.isCorrect).length;
    const total = testQuestions.length;
    const percentage = Math.round((score / total) * 10000) / 100;

    setResults({ score, total, percentage, answerEntries: entries, questions: testQuestions as never });
    setPhase("results");

    const deckId = selectedDeckId !== "all" ? selectedDeckId : decks?.[0]?._id;
    if (deckId) {
      await saveTestResult({ deckId, score, total, answers: entries }).catch(() => {});
    }
  };

  const toggleFlag = (id: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const optionValue = (card: (typeof testQuestions)[number], letter: string) =>
    (card as unknown as Record<string, string>)[`option${letter}`] ?? "";

  const answeredCount = Object.keys(answers).length;
  const progress = testQuestions.length > 0 ? (answeredCount / testQuestions.length) * 100 : 0;

  const topicBreakdown = useMemo(() => {
    if (!results) return [];
    const map: Record<string, { correct: number; total: number }> = {};
    results.answerEntries.forEach((entry) => {
      const q = (results.questions as typeof testQuestions).find((q) => q._id === entry.cardId);
      const topic = q?.topic ?? "Unknown";
      if (!map[topic]) map[topic] = { correct: 0, total: 0 };
      map[topic].total++;
      if (entry.isCorrect) map[topic].correct++;
    });
    return Object.entries(map)
      .map(([topic, { correct, total }]) => ({
        topic, correct, total, pct: Math.round((correct / total) * 100),
      }))
      .sort((a, b) => a.pct - b.pct);
  }, [results]);

  const missedEntries = results?.answerEntries.filter((e) => !e.isCorrect) ?? [];

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="space-y-7">
        <div className="flex items-center gap-3">
          <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">Practice Test</h1>
            <p className="text-sm text-muted-foreground">Randomly selected questions — score saved after submit</p>
          </div>
        </div>

        <Card className="p-6 space-y-5">
          <p className="text-base font-semibold text-foreground">Configure Test</p>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Exam</label>
            <select
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value as Id<"flashcardDecks"> | "all")}
              className="block text-sm border border-border rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All (up to 300 questions)</option>
              {(decks ?? []).map((d) => (
                <option key={d._id} value={d._id}>{d.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Number of Questions</label>
            <div className="flex gap-2 flex-wrap">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  disabled={n > poolCards.length && poolCards.length > 0}
                  className={`px-4 py-1.5 text-sm rounded-md border transition-colors disabled:opacity-40 ${
                    questionCount === n
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-foreground hover:border-ring"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {poolCards.length > 0 && (
              <p className="text-xs text-muted-foreground">{poolCards.length} questions available</p>
            )}
          </div>

          <Button
            onClick={handleStartTest}
            disabled={poolCards.length === 0}
          >
            {poolCards.length === 0 ? "Loading..." : `Start ${Math.min(questionCount, poolCards.length)}-Question Test`}
          </Button>
        </Card>

        {(pastResults ?? []).length > 0 && (
          <Card className="p-6 space-y-3">
            <p className="text-base font-semibold text-foreground">Recent Scores</p>
            <div className="space-y-2">
              {(pastResults ?? []).map((r) => (
                <div key={r._id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(r.completedAt).toLocaleDateString()} — {r.total}Q
                  </span>
                  <Badge variant={r.percentage >= 70 ? "default" : "outline"}>
                    {r.score}/{r.total} ({r.percentage}%)
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ── Test ───────────────────────────────────────────────────────────────────
  if (phase === "test") {
    return (
      <div className="space-y-6">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border pb-3 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {answeredCount}/{testQuestions.length} answered
            </span>
            <Button size="sm" onClick={handleSubmit}>Submit Test</Button>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {testQuestions.map((q, idx) => (
          <Card
            key={q._id}
            className={`p-5 transition-colors ${flagged.has(q._id) ? "border-foreground border-2" : ""}`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-muted-foreground">Q{idx + 1}</span>
                <Badge variant="muted" className="text-xs max-w-[180px] truncate">{q.topic}</Badge>
              </div>
              <button
                onClick={() => toggleFlag(q._id)}
                className={`text-xs shrink-0 transition-colors ${
                  flagged.has(q._id) ? "text-foreground font-medium" : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              >
                {flagged.has(q._id) ? "⚑ Flagged" : "⚐ Flag"}
              </button>
            </div>

            <p className="text-sm font-medium text-foreground mb-3 leading-relaxed">{q.question}</p>

            <div className="space-y-2">
              {LETTERS.filter((l) => optionValue(q, l)).map((letter) => (
                <button
                  key={letter}
                  onClick={() => setAnswers((a) => ({ ...a, [q._id]: letter }))}
                  className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    answers[q._id] === letter
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-ring text-foreground bg-background"
                  }`}
                >
                  <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold ${
                    answers[q._id] === letter ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {letter}
                  </span>
                  <span>{optionValue(q, letter)}</span>
                </button>
              ))}
            </div>
          </Card>
        ))}

        <div className="pb-8 space-y-3">
          {testQuestions.length - answeredCount > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              {testQuestions.length - answeredCount} question{testQuestions.length - answeredCount !== 1 ? "s" : ""} unanswered
            </p>
          )}
          <Button className="w-full" onClick={handleSubmit}>Submit Test</Button>
        </div>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-7">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPhase("setup")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-semibold text-foreground">Results</h1>
      </div>

      {/* Score */}
      <Card className="p-8 text-center">
        <div className="text-5xl font-bold text-foreground mb-1">
          {results!.score}/{results!.total}
        </div>
        <div className={`text-2xl font-semibold mt-1 ${results!.percentage >= 70 ? "text-foreground" : "text-muted-foreground"}`}>
          {results!.percentage}%
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {results!.percentage >= 70 ? "Passing score — great work." : "Keep studying — aim for 70% to pass."}
        </p>
      </Card>

      {/* Topic breakdown */}
      {topicBreakdown.length > 0 && (
        <Card className="p-6 space-y-5">
          <p className="text-base font-semibold text-foreground">By Topic</p>
          <div className="space-y-3">
            {topicBreakdown.map(({ topic, correct, total, pct }) => (
              <div key={topic}>
                <div className="flex justify-between text-sm mb-1 gap-2">
                  <span className="text-foreground truncate">{topic}</span>
                  <span className={`font-medium shrink-0 ${pct >= 70 ? "text-foreground" : "text-muted-foreground"}`}>
                    {correct}/{total} ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Review missed */}
      {missedEntries.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowReview((r) => !r)}
            className="w-full text-sm font-medium text-foreground border border-border rounded-lg px-4 py-2.5 hover:border-ring transition-colors"
          >
            {showReview ? "Hide" : "Review"} Missed Questions ({missedEntries.length})
          </button>

          {showReview && (
            <div className="space-y-3">
              {missedEntries.map((entry) => {
                const q = testQuestions.find((q) => q._id === entry.cardId);
                if (!q) return null;
                return (
                  <Card key={String(entry.cardId)} className="p-6">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="muted" className="text-xs">{q.topic}</Badge>
                      {entry.selectedAnswer ? (
                        <span className="text-xs text-muted-foreground">Your answer: {entry.selectedAnswer}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not answered</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mb-3">{q.question}</p>
                    <div className="space-y-1.5">
                      {LETTERS.filter((l) => optionValue(q, l)).map((letter) => {
                        const isCorrect = letter === q.correctAnswer;
                        const isChosen = letter === entry.selectedAnswer;
                        return (
                          <div
                            key={letter}
                            className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm ${
                              isCorrect
                                ? "bg-foreground text-background font-medium"
                                : isChosen
                                ? "bg-muted text-muted-foreground line-through"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span className={`w-4 h-4 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold ${
                              isCorrect ? "bg-background text-foreground"
                                : isChosen ? "bg-muted text-muted-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {letter}
                            </span>
                            <span>{optionValue(q, letter)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button className="flex-1" onClick={handleStartTest}>Take Another Test</Button>
        <Link href="/tools">
          <Button variant="outline">← Tools</Button>
        </Link>
      </div>
    </div>
  );
}
