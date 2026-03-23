export const TYPING_TEXTS = [
  "La velocidad no es solo mover los dedos rápido, es encontrar el ritmo perfecto entre mente y teclado para alcanzar la fluidez total.",
  "Cada tecla presionada con precisión te acerca más a la victoria. No se trata de correr, se trata de fluir sin errores por el texto.",
  "El arte de escribir rápido combina práctica constante con concentración profunda. Los mejores mecanógrafos hacen que parezca fácil y natural.",
  "Programar es como escribir poesía con lógica. Cada línea de código cuenta una historia que las máquinas pueden entender y ejecutar.",
  "Los grandes escritores no nacieron escribiendo rápido. Practicaron cada día hasta que sus dedos se movían solos por el teclado sin pensar.",
  "La tecnología avanza a pasos agigantados y dominar el teclado es una habilidad fundamental en el mundo digital moderno que vivimos.",
  "Respirar hondo antes de comenzar ayuda a mantener la calma. Los nervios son el peor enemigo de la velocidad al momento de escribir.",
  "Mil palabras por minuto no significan nada si cada una tiene errores. La precisión siempre debe ir primero que la velocidad pura.",
];

export function getRandomText(): string {
  return TYPING_TEXTS[Math.floor(Math.random() * TYPING_TEXTS.length)];
}
