import { Trophy, Medal, Clock, AlertCircle, Gauge } from "lucide-react";
import type { Participant } from "@/pages/Index";

interface Props {
  participants: Participant[];
}

export function Leaderboard({ participants }: Props) {
  const completed = participants
    .filter((p) => p.completed)
    .sort((a, b) => (a.time_seconds ?? Infinity) - (b.time_seconds ?? Infinity));

  const pending = participants.filter((p) => !p.completed);

  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Agrega participantes para comenzar la competencia</p>
      </div>
    );
  }

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-xs text-muted-foreground font-mono">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {completed.length > 0 && (
        <div className="space-y-2">
          {completed.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                i === 0
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-muted border border-border"
              }`}
            >
              <div className="flex-shrink-0">{getMedalIcon(i)}</div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold truncate ${
                    i === 0 ? "text-primary" : "text-foreground"
                  }`}
                >
                  {p.name}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-mono font-bold">
                    {p.time_seconds?.toFixed(1)}s
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-mono">{p.wpm} wpm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span
                    className={`font-mono ${
                      p.errors > 0 ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {p.errors}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground px-1">
            Pendientes
          </p>
          {pending.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground">{p.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
