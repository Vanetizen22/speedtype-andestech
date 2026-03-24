export const TYPING_TEXTS = [
  "La velocidad de escritura no es mover los dedos con rapidez, sino encontrar el ritmo perfecto entre la mente y las manos. Los mejores mecanografos han desarrollado una memoria muscular que les permite escribir sin mirar las teclas. El secreto esta en la constancia y la paciencia, sabiendo que cada error es una oportunidad de aprendizaje.",

  "Cada tecla presionada con precision te acerca a la victoria en este desafio. No se trata de correr contra el tiempo, sino de fluir sin errores manteniendo un ritmo constante. La clave esta en no sacrificar la exactitud por la rapidez, ya que los errores cuestan mas tiempo del que ahorras escribiendo descuidado.",

  "El arte de escribir rapido combina elementos que van mas alla de presionar teclas. Requiere practica constante, concentracion profunda y una postura ergonomica que prevenga lesiones. Los mejores mecanografos hacen que esta habilidad parezca natural, pero detras hay anos de dedicacion y miles de palabras escritas diariamente.",

  "Programar es como escribir poesia con logica pura. Cada linea de codigo cuenta una historia que las maquinas pueden entender y ejecutar con precision. Los desarrolladores pasan horas frente al teclado transformando ideas en aplicaciones. Dominar la escritura rapida permite mantener el flujo de pensamiento sin interrupciones al codificar.",

  "Los grandes escritores no nacieron escribiendo a velocidades impresionantes. Cada uno practico hasta que sus dedos se movian solos, sin pensar en cada letra. Esta automatizacion libera la mente para concentrarse en las ideas y la creatividad. El teclado se convierte en una extension natural del pensamiento humano.",

  "La tecnologia avanza y dominar el teclado es una habilidad fundamental en el entorno digital moderno. Estudiantes y profesionales se benefician de escribir con fluidez y sin errores. Las estadisticas muestran que mejorar la velocidad de escritura puede aumentar la productividad personal en un cuarenta por ciento.",

  "Respirar profundamente antes de una prueba ayuda a mantener la calma y la concentracion necesaria. Los nervios son los peores enemigos de la velocidad bajo presion. Los competidores profesionales utilizan tecnicas de respiracion para alcanzar estados de concentracion optima antes de cada competicion importante.",

  "La precision siempre debe ir antes que la velocidad pura. Un texto con errores requiere tiempo de correccion que elimina cualquier ventaja ganada. Los expertos recomiendan mantener una tasa de precision del noventa y cinco por ciento antes de intentar aumentar la velocidad al siguiente nivel de rendimiento.",

  "El teclado moderno tiene sus raices en la maquina de escribir del siglo diecinueve. Su disposicion QWERTY fue disenada para evitar que las barras de metal se trabaran. Aunque hoy usamos teclados digitales, el diseno ha perdurado por mas de ciento cincuenta anos gracias a su familiaridad universal.",

  "La mecanografia profesional es un deporte con campeonatos donde los mejores superan las doscientas palabras por minuto. Estos atletas del teclado entrenan horas cada dia desarrollando resistencia mental extraordinaria. Sus dedos se mueven con una velocidad que parece sobrehumana para cualquier observador que los ve competir.",

  "La memoria muscular es el fundamento de la mecanografia experta. Cuando los dedos aprenden donde esta cada tecla sin buscar visualmente, la velocidad aumenta de forma exponencial. Este proceso requiere semanas de practica antes de manifestarse. Una vez dominado, escribir se vuelve un acto casi inconsciente y completamente fluido.",

  "Los teclados mecanicos han ganado popularidad entre entusiastas y programadores de todo el mundo. La retroalimentacion tactil mejora la precision porque el usuario siente cuando cada tecla fue activada. Existen diferentes tipos de switches con caracteristicas propias de resistencia y sonido para distintos estilos de escritura.",

  "La posicion correcta de los dedos es fundamental para escribir rapido sin fatiga. Los indices descansan sobre F y J, que tienen marcas tactiles para orientarse sin mirar. Desde esta posicion base, cada dedo cubre teclas especificas de forma natural. Romper este habito es uno de los errores mas costosos para los principiantes.",

  "Escribir rapido con precision no es un talento innato, es una habilidad aprendida. Cualquier persona dedicada puede desarrollarla con practica adecuada y constante. Los ninos que aprenden mecanografia desde joven desarrollan una ventaja que los acompana toda la vida. Nunca es tarde para mejorar en el mundo digital.",

  "La concentracion separa a los mecanografos ordinarios de los extraordinarios. Cuando la mente se distrae, los dedos cometen errores que interrumpen el flujo y reducen la velocidad. Los avanzados aprenden a entrar en estado de flujo donde los dedos se mueven de forma automatica. Lograrlo requiere practica y dedicacion constante."
];

export function getTextByIndex(index: number): string {
  return TYPING_TEXTS[index % TYPING_TEXTS.length];
}
