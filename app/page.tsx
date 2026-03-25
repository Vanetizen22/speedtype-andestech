"use client";

import { useState, useCallback, useEffect } from "react";
import { ParticipantForm } from "@/components/participant-form";
import { TypingTest } from "@/components/typing-test";
import { Leaderboard, type Participant } from "@/components/leaderboard";
import { Button } from "@/components/ui/button";
import { Keyboard, Play, RotateCcw, Trophy, Plus, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getTextByIndex } from "@/lib/texts";

interface Competition {
  id: string;
  created_at: string;
  name: string;
}

export default function Home() {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing competition on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/competition");
        const data = await res.json();
        if (data.competition) {
          setCompetition(data.competition);
          setParticipants(data.participants.map((p: Participant) => ({
            ...p,
            time_seconds: p.time_seconds ?? null,
          })));
        }
      } catch {
        toast.error("Error al cargar la competencia");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const createCompetition = async () => {
    try {
      const res = await fetch("/api/competition", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCompetition(data.competition);
      setParticipants([]);
      toast.success("Competencia creada");
    } catch {
      toast.error("Error al crear la competencia");
    }
  };

  const addParticipant = async (name: string) => {
    if (!competition) return;
    const text = getTextByIndex(participants.length);
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competition_id: competition.id, name, text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setParticipants((prev) => [...prev, { ...data.participant, time_seconds: null }]);
      toast.success(`${name} agregado a la competencia`);
    } catch {
      toast.error("Error al agregar participante");
    }
  };

  const handleComplete = useCallback(
    async (time: number, errors: number, wpm: number) => {
      if (!currentPlayer) return;
      try {
        const res = await fetch("/api/participants", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentPlayer, time_seconds: time, errors, wpm }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === currentPlayer
              ? { ...p, time_seconds: time, errors, wpm, completed: true }
              : p
          )
        );
        toast.success("Resultado guardado");
      } catch {
        toast.error("Error al guardar resultado");
      } finally {
        setCurrentPlayer(null);
      }
    },
    [currentPlayer]
  );

  const resetAll = async () => {
    if (!competition) return;
    try {
      const res = await fetch("/api/competition", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitionId: competition.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setParticipants([]);
      toast.success("Competencia reiniciada");
    } catch {
      toast.error("Error al reiniciar la competencia");
    }
  };

  const newCompetition = async () => {
    await createCompetition();
  };

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado al portapapeles");
  };

  const pendingPlayers = participants.filter((p) => !p.completed);
  const completedPlayers = participants.filter((p) => p.completed);
  const allDone = participants.length > 0 && pendingPlayers.length === 0;
  const winner = allDone
    ? [...completedPlayers].sort(
        (a, b) => (a.time_seconds ?? Infinity) - (b.time_seconds ?? Infinity)
      )[0]
    : null;

  const activeParticipant = participants.find((p) => p.id === currentPlayer);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // No competition yet - show start screen
  if (!competition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-3">
            <Keyboard className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Speed<span className="text-primary">Type</span>
              </h1>
              <p className="text-muted-foreground text-xs tracking-widest">
                by AndesTech
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Crea una competencia de escritura rapida, invita participantes y
            descubre quien es el mas veloz.
          </p>
          <Button
            onClick={createCompetition}
            size="lg"
            className="gap-2 text-lg px-8"
          >
            <Plus className="w-5 h-5" />
            Nueva Competencia
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3">
            <Keyboard className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Speed<span className="text-primary">Type</span>
              </h1>
              <p className="text-muted-foreground text-xs tracking-widest">
                by AndesTech
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Competencia de escritura rapida
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={shareLink}
            className="gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartir link
          </Button>
        </div>

        {/* Winner banner */}
        {allDone && winner && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center space-y-2">
            <Trophy className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="text-xs uppercase tracking-widest text-amber-500">
              Ganador
            </p>
            <p className="text-2xl font-bold text-amber-500">{winner.name}</p>
            <p className="text-muted-foreground text-sm">
              {winner.time_seconds?.toFixed(1)}s - {winner.wpm} WPM -{" "}
              {winner.errors} errores
            </p>
          </div>
        )}

        {/* Typing test active */}
        {activeParticipant ? (
          <TypingTest
            participantName={activeParticipant.name}
            text={activeParticipant.text}
            onComplete={handleComplete}
            onCancel={() => setCurrentPlayer(null)}
          />
        ) : (
          <>
            {/* Registration */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                Agregar participante
              </h2>
              <ParticipantForm
                onAdd={addParticipant}
                existingNames={participants.map((p) => p.name.toLowerCase())}
              />
            </div>

            {/* Start turns */}
            {pendingPlayers.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                  Iniciar turno
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pendingPlayers.map((p) => (
                    <Button
                      key={p.id}
                      variant="outline"
                      onClick={() => setCurrentPlayer(p.id)}
                      className="gap-2"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {p.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                  Clasificacion
                </h2>
                <div className="flex gap-2">
                  {participants.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetAll}
                      className="gap-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reiniciar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={newCompetition}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nueva
                  </Button>
                </div>
              </div>
              <Leaderboard participants={participants} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
