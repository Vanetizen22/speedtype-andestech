import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { ParticipantForm } from "@/components/ParticipantForm";
import { TypingTest } from "@/components/TypingTest";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Keyboard, Play, RotateCcw, Trophy, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";

type Participant = Tables<"participants">;

export default function Index() {
  const [competitionId, setCompetitionId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize or load competition from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get("c");
    if (cId) {
      setCompetitionId(cId);
      loadParticipants(cId);
    } else {
      setLoading(false);
    }
  }, []);

  // Real-time subscription
  useEffect(() => {
    if (!competitionId) return;

    const channel = supabase
      .channel("participants-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
          filter: `competition_id=eq.${competitionId}`,
        },
        () => {
          loadParticipants(competitionId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [competitionId]);

  const loadParticipants = async (cId: string) => {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("competition_id", cId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Error cargando participantes");
    } else {
      setParticipants(data || []);
    }
    setLoading(false);
  };

  const createCompetition = async () => {
    const { data, error } = await supabase
      .from("competitions")
      .insert({ name: "Competencia" })
      .select()
      .single();

    if (error || !data) {
      toast.error("Error creando competencia");
      return;
    }

    setCompetitionId(data.id);
    window.history.replaceState(null, "", `?c=${data.id}`);
    setLoading(false);
  };

  const addParticipant = async (name: string) => {
    if (!competitionId) return;

    const { error } = await supabase
      .from("participants")
      .insert({ competition_id: competitionId, name });

    if (error) {
      toast.error("Error agregando participante");
    }
  };

  const handleComplete = useCallback(
    async (time: number, errors: number, wpm: number) => {
      if (!currentPlayer) return;

      const { error } = await supabase
        .from("participants")
        .update({ time_seconds: time, errors, wpm, completed: true })
        .eq("id", currentPlayer);

      if (error) {
        toast.error("Error guardando resultado");
      }
      setCurrentPlayer(null);
    },
    [currentPlayer]
  );

  const resetAll = async () => {
    if (!competitionId) return;
    // Delete all participants for this competition
    await supabase.from("participants").delete();
    // We can't delete via RLS (no delete policy), so create a new competition
    const { data, error } = await supabase
      .from("competitions")
      .insert({ name: "Competencia" })
      .select()
      .single();
    if (data && !error) {
      setCompetitionId(data.id);
      setParticipants([]);
      window.history.replaceState(null, "", `?c=${data.id}`);
    }
  };

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("¡Link copiado al portapapeles!");
  };

  const pendingPlayers = participants.filter((p) => !p.completed);
  const completedPlayers = participants.filter((p) => p.completed);
  const allDone = participants.length > 0 && pendingPlayers.length === 0;
  const winner = allDone
    ? [...completedPlayers].sort((a, b) => (a.time_seconds ?? Infinity) - (b.time_seconds ?? Infinity))[0]
    : null;

  const activeParticipant = participants.find((p) => p.id === currentPlayer);

  // No competition yet — show start screen
  if (!competitionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-3">
            <Keyboard className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Speed<span className="text-primary text-glow-primary">Type</span>
              </h1>
              <p className="text-muted-foreground text-xs tracking-widest">by AndesTech</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Crea una competencia de escritura rápida, invita participantes y descubre quién es el más veloz.
          </p>
          <Button onClick={createCompetition} size="lg" className="neon-glow gap-2 text-lg px-8">
            <Plus className="w-5 h-5" />
            Nueva Competencia
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-glow-primary font-mono-code text-lg animate-pulse">Cargando...</div>
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
                Speed<span className="text-primary text-glow-primary">Type</span>
              </h1>
              <p className="text-muted-foreground text-xs tracking-widest">by AndesTech</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Competencia de escritura rápida</p>
          <Button variant="outline" size="sm" onClick={shareLink} className="gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            Compartir link
          </Button>
        </div>

        {/* Winner banner */}
        {allDone && winner && (
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6 text-center space-y-2 amber-glow">
            <Trophy className="w-10 h-10 text-secondary mx-auto" />
            <p className="text-xs uppercase tracking-widest text-secondary">¡Ganador!</p>
            <p className="text-2xl font-bold text-secondary text-glow-secondary">{winner.name}</p>
            <p className="text-muted-foreground text-sm">
              {winner.time_seconds?.toFixed(1)}s · {winner.wpm} WPM · {winner.errors} errores
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
