"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface ParticipantFormProps {
  onAdd: (name: string) => void | Promise<void>;
  existingNames: string[];
}

export function ParticipantForm({ onAdd, existingNames }: ParticipantFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (existingNames.includes(trimmed.toLowerCase())) return;
    onAdd(trimmed);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del participante..."
        className="bg-muted border-border font-mono-code text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-primary"
      />
      <Button type="submit" className="gap-2 font-semibold">
        <UserPlus className="w-4 h-4" />
        Agregar
      </Button>
    </form>
  );
}
