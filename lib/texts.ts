export const TYPING_TEXTS = [
  "La inteligencia artificial transforma como escriben codigo los desarrolladores modernos. Los modelos de lenguaje sugieren funciones y detectan errores en tiempo real.",

  "Blockchain es tecnologia de registro distribuido que garantiza la inmutabilidad de datos. Cada bloque contiene un hash formando una cadena verificable y segura.",

  "El diseno moderno prioriza la experiencia del usuario sobre la estetica visual pura. Un diseñador equilibra funcionalidad con belleza para crear productos memorables.",

  "Los contratos inteligentes ejecutan programas automaticamente sobre la blockchain eliminando intermediarios. Permiten transacciones confiables sin necesidad de terceras partes involucradas.",

  "El aprendizaje automatico permite identificar patrones en grandes volumenes de datos. Esta capacidad revoluciona sectores como salud, finanzas y comercio actual.",

  "Un desarrollador full stack domina frontend y backend de aplicaciones web modernas. Esta versatilidad permite construir productos completos de manera independiente.",

  "Las redes neuronales se inspiran en el cerebro humano para aprender. Reconocen imagenes, texto y voz con precision utilizando capas de informacion.",

  "Web3 propone internet descentralizado donde usuarios controlan sus propios datos digitales. Esta vision desafia plataformas tecnologicas centralizadas que dominan actualmente.",

  "El diseño responsivo adapta interfaces a cualquier dispositivo o tamano de pantalla. Esta tecnica es esencial para experiencia consistente en mundo movil.",

  "Los microservicios dividen aplicaciones grandes en servicios pequeños e independientes entre si. Este enfoque facilita escalado, mantenimiento y despliegue continuo en produccion.",

  "La criptografia es pilar fundamental para seguridad en blockchain moderna actualizada. Sin algoritmos como SHA-256 no existirian criptomonedas ni contratos inteligentes.",

  "El procesamiento del lenguaje natural permite maquinas entender y generar texto. Esta rama de IA impulsa asistentes virtuales y chatbots modernos.",

  "Los sistemas de diseno unifican componentes visuales en un producto digital. Garantizan coherencia visual y agilizan trabajo entre diseñadores y desarrolladores.",

  "DevOps integra desarrollo software con operaciones infraestructura de manera continua. Permite lanzar actualizaciones frecuentes con calidad y menor riesgo operativo.",

  "Los tokens NFT representan propiedad digital unica sobre cadena de bloques. Han abierto modelos negocio para artistas y creadores de contenido.",

  "La computacion nube permite acceder recursos procesamiento almacenamiento forma remota. Empresas todos tamanos se benefician de flexibilidad escalabilidad completa.",

  "Los algoritmos recomendacion analizan comportamiento usuario predecir sus preferencias. Tecnologia presente plataformas streaming, comercio y redes sociales.",

  "El codigo abierto permite desarrolladores estudiar, modificar distribuir software libremente. Modelo colaborativo produjo herramientas mas importantes internet actual.",

  "Las dApps funcionan sobre redes blockchain sin servidor central involucrado. Ofrecen transparencia resistencia censura comparadas aplicaciones tradicionales.",

  "La accesibilidad web garantiza personas discapacidad usen cualquier sitio digital. Buenas practicas mejoran SEO usabilidad general del producto.",

  "Los modelos lenguaje grande entrenan millones textos generar respuestas coherentes. Capacidad razonamiento generacion sorprendio comunidad cientifica mundial.",

  "La seguridad informatica protege sistemas digitales accesos no autorizados ataques. En era datos disciplina se vuelve critica valorada.",

  "El prototipado rapido diseno valida ideas usuarios reales antes construir. Herramientas como Figma democratizaron proceso para equipos cualquier tamano.",

  "Las API REST permiten aplicaciones comunicarse entre si manera estandarizada. Conectan frontends, backends servicios externos ecosistema digital actual.",

  "La tokenizacion activos representa bienes mundo real dentro blockchain global. Inmuebles obras arte fraccionarse transarse digitalmente con seguridad.",

  "El edge computing procesa datos cerca donde generan en lugar nube. Reduce latencia mejora rendimiento aplicaciones tiempo real.",

  "Los sistemas multiagente coordinan multiples agentes autonomos resolver problemas complejos. Tecnologia clave robotica, logistica simulaciones complejas.",

  "El diseno centrado usuario investigar necesidades reales crear soluciones digitales. Entender usuario evita construir productos nadie quiere usar.",

  "La infraestructura codigo gestiona servidores redes mediante archivos configuracion versionados. Herramientas como Terraform hacen entornos reproducibles auditables.",

  "Los grafos conocimiento organizan informacion forma nodos relaciones semanticas. Base motores busqueda inteligentes sistemas recomendacion avanzados."
];

export function getTextByIndex(index: number): string {
  return TYPING_TEXTS[index % TYPING_TEXTS.length];
}
