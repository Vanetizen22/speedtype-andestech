import { useState, useEffect, useRef, useCallback } from "react";
import { getRandomText } from "@/lib/texts";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play } from "lucide-react";

interface Props {
  participantName: string;
  onComplete: (time: number, errors: number, wpm: number) => void;
  onCancel: () => void;
}

export function TypingTest({ participantName, onComplete, onCancel }: Props) {
  const [targetText] = useState(() => getRandomText());
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const errors = typed.split("").filter((ch, i) => ch !== targetText[i]).length;
  const isComplete = typed.length === targetText.length;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isComplete && startTime) {
      stopTimer();
      const totalTime = (Date.now() - startTime) / 1000;
      const words = targetText.split(" ").length;
      const wpm = Math.round((words / totalTime) * 60);
      onComplete(totalTime, errors, wpm);
    }
  }, [isComplete, startTime, errors, targetText, onComplete, stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - Date.now()) / 1000);
    }, 100);
    // Fix: use a closure over the start time
    const now = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - now) / 1000);
    }, 100);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= targetText.length) {
      setTyped(val);
    }
  };

  const renderText = () => {
    return targetText.split("").map((char, i) => {
      let className = "text-muted-foreground"; // not typed yet
      if (i < typed.length) {
        className = typed[i] === char ? "text-primary" : "text-destructive underline";
      }
      if (i === typed.length) {
        className += " border-l-2 border-primary animate-pulse";
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Turno de</p>
          <h2 className="text-3xl font-bold text-amber-500">{participantName}</h2>
        </div>
        <p className="text-muted-foreground text-center max-w-md">
          Cuando estes listo, presiona el boton. El cronometro comenzara inmediatamente.
        </p>
        <div className="flex gap-3">
          <Button onClick={handleStart} size="lg" className="gap-2 text-lg px-8">
            <Play className="w-5 h-5" />
            Comenzar
          </Button>
          <Button onClick={onCancel} variant="outline" size="lg">
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Escribiendo</p>
          <p className="text-amber-500 font-semibold">{participantName}</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-primary">{elapsed.toFixed(1)}s</p>
            <p className="text-xs text-muted-foreground">Tiempo</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-mono font-bold ${errors > 0 ? 'text-destructive' : 'text-primary'}`}>{errors}</p>
            <p className="text-xs text-muted-foreground">Errores</p>
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-6 font-mono-code text-lg leading-relaxed tracking-wide select-none">
        {renderText()}
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        className="opacity-0 absolute pointer-events-auto w-full h-12"
        autoFocus
        onBlur={() => inputRef.current?.focus()}
      />

      <p className="text-center text-muted-foreground text-sm">
        Escribe el texto exactamente como aparece arriba
      </p>
    </div>
  );
}
