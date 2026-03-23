import { useState, useCallback } from "react";
import { Participant } from "@/lib/types";
import { ParticipantForm } from "@/components/ParticipantForm";
import { TypingTest } from "@/components/TypingTest";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Keyboard, Play, RotateCcw, Trophy } from "lucide-react";

export default function Index() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

  const addParticipant = (name: string) => {
    setParticipants((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, time: null, errors: 0, wpm: 0, completed: false },
    ]);
  };

  const startTurn = (id: string) => {
    setCurrentPlayer(id);
  };

  const handleComplete = useCallback(
    (time: number, errors: number, wpm: number) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === currentPlayer ? { ...p, time, errors, wpm, completed: true } : p
        )
      );
      setCurrentPlayer(null);
    },
    [currentPlayer]
  );

  const resetAll = () => {
    setParticipants([]);
    setCurrentPlayer(null);
  };

  const pendingPlayers = participants.filter((p) => !p.completed);
  const allDone = participants.length > 0 && pendingPlayers.length === 0;
  const winner = allDone
    ? [...participants].sort((a, b) => (a.time ?? Infinity) - (b.time ?? Infinity))[0]
    : null;

  const activeParticipant = participants.find((p) => p.id === currentPlayer);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3">
            <Keyboard className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Speed<span className="text-primary text-glow-primary">Type</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Competencia de escritura rápida</p>
        </div>

        {/* Winner banner */}
        {allDone && winner && (
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6 text-center space-y-2 amber-glow">
            <Trophy className="w-10 h-10 text-secondary mx-auto" />
            <p className="text-xs uppercase tracking-widest text-secondary">¡Ganador!</p>
            <p className="text-2xl font-bold text-secondary text-glow-secondary">{winner.name}</p>
            <p className="text-muted-foreground text-sm">
              {winner.time?.toFixed(1)}s · {winner.wpm} WPM · {winner.errors} errores
            </p>
          </div>
        )}

        {/* Typing test active */}
        {activeParticipant ? (
          <div className="bg-card border border-border rounded-xl p-6">
            <TypingTest
              participantName={activeParticipant.name}
              onComplete={handleComplete}
              onCancel={() => setCurrentPlayer(null)}
            />
          </div>
        ) : (
          <>
            {/* Registration */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Agregar participante</h2>
              <ParticipantForm
                onAdd={addParticipant}
                existingNames={participants.map((p) => p.name.toLowerCase())}
              />
            </div>

            {/* Start turns */}
            {pendingPlayers.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Iniciar turno</h2>
                <div className="flex flex-wrap gap-2">
                  {pendingPlayers.map((p) => (
                    <Button
                      key={p.id}
                      variant="outline"
                      onClick={() => startTurn(p.id)}
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
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Clasificación</h2>
                {participants.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1.5 text-muted-foreground hover:text-destructive">
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
