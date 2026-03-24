"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface TypingTestProps {
  participantName: string;
  text: string;
  onComplete: (time: number, errors: number, wpm: number) => void;
  onCancel: () => void;
}

export function TypingTest({ participantName, text, onComplete, onCancel }: TypingTestProps) {
  const targetText = text;
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
    const now = Date.now();
    setStartTime(now);
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
      let className = "text-muted-foreground";
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

  // Pantalla previa al inicio
  if (!started) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          backgroundColor: "hsl(var(--background))",
          zIndex: 50,
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
            Turno de
          </p>
          <h2 className="text-4xl font-bold text-amber-500">{participantName}</h2>
        </div>
        <p className="text-muted-foreground text-center" style={{ maxWidth: "420px" }}>
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

  // Pantalla de escritura activa
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(var(--background))",
        zIndex: 50,
        boxSizing: "border-box",
        padding: "2rem",
      }}
    >
      {/* Contenedor central acotado */}
      <div style={{ width: "100%", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Estadísticas */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-widest">Escribiendo</p>
            <p className="text-amber-500 font-semibold text-lg">{participantName}</p>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ textAlign: "center" }}>
              <p className="text-3xl font-mono font-bold text-primary">{elapsed.toFixed(1)}s</p>
              <p className="text-xs text-muted-foreground">Tiempo</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p className={`text-3xl font-mono font-bold ${errors > 0 ? "text-destructive" : "text-primary"}`}>
                {errors}
              </p>
              <p className="text-xs text-muted-foreground">Errores</p>
            </div>
          </div>
        </div>

        {/* Caja de texto */}
        <div
          className="bg-muted rounded-xl select-none"
          style={{
            padding: "1.75rem",
            fontFamily: "monospace",
            fontSize: "1rem",
            lineHeight: "1.9",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {renderText()}
        </div>

        {/* Input invisible */}
        <input
          ref={inputRef}
          value={typed}
          onChange={handleInput}
          style={{ position: "absolute", opacity: 0, pointerEvents: "auto", width: "1px", height: "1px" }}
          autoFocus
          onBlur={() => inputRef.current?.focus()}
        />

        <p className="text-center text-muted-foreground text-sm">
          Escribe el texto exactamente como aparece arriba
        </p>
      </div>
    </div>
  );
}
