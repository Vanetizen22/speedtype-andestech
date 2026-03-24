export const TYPING_TEXTS = [
  "La velocidad de escritura requiere practica constante y dedicacion diaria. El secreto esta en encontrar el ritmo perfecto entre la mente y las manos para escribir con fluidez.",

  "Cada tecla presionada con precision te acerca mas a la victoria en la competencia. La exactitud siempre debe ir primero que la rapidez para obtener el mejor resultado posible.",

  "El arte de escribir rapido combina concentracion profunda y buena postura corporal. Los mejores mecanografos desarrollan una memoria muscular completamente automatica con el tiempo.",

  "Programar exige escritura rapida y muy precisa en todo momento. Dominar el teclado permite mantener el flujo de pensamiento creativo sin interrupciones molestas durante el trabajo.",

  "Los grandes escritores no nacieron dominando la mecanografia desde el inicio. Todos practicaron incansablemente durante anos hasta desarrollar esta valiosa habilidad de manera natural.",

  "La tecnologia moderna exige dominio real del teclado para ser productivo. Mejorar tu velocidad de escritura aumenta significativamente tu rendimiento y productividad personal cada dia.",

  "Respirar profundamente antes de escribir ayuda a mantener la calma necesaria. Los competidores profesionales usan tecnicas de respiracion y visualizacion para mejorar su concentracion.",

  "La precision es siempre mas importante que la velocidad pura de escritura. Mantener un alto porcentaje de precision es clave antes de intentar aumentar la velocidad gradualmente.",

  "El teclado QWERTY tiene mas de ciento cincuenta anos de historia en el mundo. Su diseno clasico ha perdurado gracias a su familiaridad universal entre millones de usuarios.",

  "Los mejores mecanografos del mundo escriben sobre doscientas palabras por minuto. Estos increibles atletas del teclado entrenan durante muchas horas rigurosas cada dia de la semana.",

  "La memoria muscular es fundamental para dominar la mecanografia de manera experta. Cuando los dedos aprenden sin buscar teclas visualmente la velocidad aumenta de forma exponencial.",

  "Los teclados mecanicos mejoran significativamente la precision al escribir con fuerza. La retroalimentacion tactil ayuda a saber exactamente cuando cada tecla fue correctamente activada.",

  "La posicion correcta de los dedos sobre el teclado previene la fatiga acumulada. Los indices descansan sobre F y J para mantener siempre la orientacion correcta sin mirar.",

  "Escribir rapido es una habilidad completamente aprendida y no un talento innato especial. Cualquier persona suficientemente dedicada puede mejorar significativamente con practica constante.",

  "La concentracion total es lo que separa a los mecanografos ordinarios de los extraordinarios. Entrar en estado de flujo requiere practica deliberada, paciencia y mucha dedicacion personal.",

  "Las competencias de mecanografia ponen a prueba los limites de velocidad y precision humana. Participar en ellas es una experiencia emocionante que motiva a seguir mejorando cada vez mas.",

  "Escribir sin mirar el teclado es una tecnica que todo profesional debe dominar completamente. Esta habilidad libera la vista para enfocarse en la pantalla y mejorar la calidad del trabajo.",

  "La practica diaria de quince minutos es suficiente para mejorar la velocidad de escritura. La constancia a lo largo del tiempo produce resultados sorprendentes y completamente medibles.",

  "Un mecanografo experto puede escribir un documento completo sin cometer errores graves. Esta combinacion de velocidad y precision es el objetivo final de cualquier practicante serio.",

  "La competencia amistosa entre colegas es una excelente manera de mejorar la mecanografia. Comparar resultados motiva a cada participante a superar su propio marcador anterior.",

  "Dominar las teclas de funcion y los atajos de teclado aumenta mucho la productividad diaria. Cada atajo aprendido ahorra segundos valiosos que se acumulan en horas al cabo del mes.",

  "El ritmo constante al escribir produce mejores resultados que las rafagas de velocidad. Mantener una cadencia uniforme reduce los errores y mejora el tiempo total del intento.",

  "Las manos relajadas sobre el teclado permiten escribir mas rapido y con menos fatiga muscular. La tension en los dedos y muniercas es el principal enemigo de la velocidad sostenida.",

  "Cada participante en esta competencia da lo mejor de si mismo frente al teclado. El esfuerzo y la concentracion de cada uno merecen reconocimiento sin importar el resultado final.",

  "La mecanografia es una habilidad que combina mente agil y dedos bien entrenados. Quienes la dominan tienen una ventaja clara en cualquier entorno profesional del mundo moderno."
];

export function getTextByIndex(index: number): string {
  return TYPING_TEXTS[index % TYPING_TEXTS.length];
}
