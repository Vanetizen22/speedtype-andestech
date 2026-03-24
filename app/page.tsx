"use client";

import { useState, useCallback } from "react";
import { ParticipantForm } from "@/components/participant-form";
import { TypingTest } from "@/components/typing-test";
import { Leaderboard, type Participant } from "@/components/leaderboard";
import { Button } from "@/components/ui/button";
import { Keyboard, Play, RotateCcw, Trophy, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getTextByIndex } from "@/lib/texts";

export default function Home() {
  const [competitionStarted, setCompetitionStarted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

  const createCompetition = () => {
    setCompetitionStarted(true);
    toast.success("Competencia creada");
  };

  const addParticipant = (name: string) => {
    setParticipants((prev) => {
      const newParticipant: Participant = {
        id: crypto.randomUUID(),
        name,
        text: getTextByIndex(prev.length),
        time_seconds: null,
        errors: 0,
        wpm: 0,
        completed: false,
        created_at: new Date().toISOString(),
      };
      return [...prev, newParticipant];
    });
    toast.success(`${name} agregado a la competencia`);
  };

  const handleComplete = useCallback(
    (time: number, errors: number, wpm: number) => {
      if (!currentPlayer) return;

      setParticipants((prev) =>
        prev.map((p) =>
          p.id === currentPlayer
            ? { ...p, time_seconds: time, errors, wpm, completed: true }
            : p
        )
      );
      setCurrentPlayer(null);
      toast.success("Resultado guardado");
    },
    [currentPlayer]
  );

  const resetAll = () => {
    setParticipants([]);
    toast.success("Competencia reiniciada");
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

  // No competition yet - show start screen
  if (!competitionStarted) {
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

        {/* Typing test active — el componente maneja su propio fullscreen */}
        {activeParticipant ? (
          <>
            <TypingTest
              participantName={activeParticipant.name}
              text={activeParticipant.text}
              onComplete={handleComplete}
              onCancel={() => setCurrentPlayer(null)}
            />
          </>
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
              </div>
              <Leaderboard participants={participants} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
