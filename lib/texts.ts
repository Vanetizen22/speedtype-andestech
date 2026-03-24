export const TYPING_TEXTS = [
  "La velocidad de escritura requiere practica constante. El secreto esta en encontrar el ritmo perfecto entre la mente y las manos.",

  "Cada tecla presionada con precision te acerca a la victoria. La precision siempre debe ir primero que la rapidez.",

  "El arte de escribir rapido combina concentracion y postura. Los mejores mecanografos desarrollan memoria muscular automatica.",

  "Programar requiere escritura rapida y precisa. Dominar el teclado permite mantener el flujo de pensamiento sin interrupciones.",

  "Los grandes escritores no nacieron escribiendo rapido. Todos practicaron incansablemente hasta desarrollar esta habilidad natural.",

  "La tecnologia moderna requiere dominio del teclado. Mejorar tu velocidad aumenta significativamente tu productividad personal.",

  "Respirar profundamente antes de escribir mantiene la calma. Los competidores profesionales usan tecnicas de respiracion y visualizacion.",

  "La precision es mas importante que la velocidad pura. Mantener noventa y cinco por ciento de precision antes de aumentar velocidad.",

  "El teclado QWERTY tiene mas de ciento cincuenta anos. Su diseno ha perdurado por su familiaridad universal.",

  "Los mejores mecanografos escriben sobre doscientas palabras por minuto. Estos atletas del teclado entrenan horas cada dia.",

  "La memoria muscular es fundamental en la mecanografia. Cuando los dedos aprenden sin buscar visualmente la velocidad aumenta exponencialmente.",

  "Los teclados mecanicos mejoran significativamente la precision. La retroalimentacion tactil ayuda a los dedos a saber exactamente cuando una tecla fue activada.",

  "La posicion correcta de los dedos previene fatiga. Los indices descansan sobre F y J para mantener orientacion.",

  "Escribir rapido es una habilidad aprendida no innata. Cualquier persona dedicada puede mejorar con practica constante.",

  "La concentracion total separa a los mecanografos ordinarios de los extraordinarios. Entrar en flujo requiere practica deliberada y paciencia."
];

export function getTextByIndex(index: number): string {
  return TYPING_TEXTS[index % TYPING_TEXTS.length];
}
