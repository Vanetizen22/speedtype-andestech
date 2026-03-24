export const TYPING_TEXTS = [
  "La inteligencia artificial esta transformando la manera en que los desarrolladores escriben codigo. Los modelos de lenguaje sugieren funciones completas y detectan errores en tiempo real.",

  "Blockchain es una tecnologia de registro distribuido que garantiza la inmutabilidad de los datos. Cada bloque contiene un hash del anterior formando una cadena verificable y segura.",

  "El diseno de interfaces modernas prioriza la experiencia del usuario sobre la estetica visual. Un buen diseñador equilibra la funcionalidad con la belleza para crear productos memorables.",

  "Los contratos inteligentes son programas que se ejecutan automaticamente sobre la blockchain. Eliminan intermediarios y permiten transacciones confiables sin necesidad de terceras partes.",

  "El aprendizaje automatico permite a las maquinas identificar patrones en grandes volumenes de datos. Esta capacidad esta revolucionando sectores como la salud, finanzas y el comercio.",

  "Un desarrollador full stack domina tanto el frontend como el backend de una aplicacion web. Esta versatilidad permite construir productos completos de manera independiente y eficiente.",

  "Las redes neuronales artificiales se inspiran en el funcionamiento del cerebro humano para aprender. Procesan capas de informacion para reconocer imagenes, texto y voz con alta precision.",

  "Web3 propone un internet descentralizado donde los usuarios controlan sus propios datos digitales. Esta vision desafia el modelo actual dominado por grandes plataformas tecnologicas centralizadas.",

  "El diseño responsivo adapta la interfaz de una aplicacion a cualquier dispositivo o tamano de pantalla. Esta tecnica es esencial para ofrecer una experiencia consistente en el mundo movil.",

  "Los microservicios dividen una aplicacion grande en servicios pequeños e independientes entre si. Este enfoque facilita el escalado, el mantenimiento y el despliegue continuo en produccion.",

  "La criptografia es el pilar fundamental que hace posible la seguridad en la blockchain moderna. Sin algoritmos como SHA-256 no existirian las criptomonedas ni los contratos inteligentes.",

  "El procesamiento del lenguaje natural permite a las maquinas entender y generar texto humano. Esta rama de la inteligencia artificial impulsa a los asistentes virtuales y chatbots modernos.",

  "Los sistemas de diseno unifican los componentes visuales de un producto digital en un solo lugar. Garantizan coherencia visual y agilizan el trabajo conjunto entre diseñadores y desarrolladores.",

  "DevOps integra el desarrollo de software con las operaciones de infraestructura de manera continua. Esto permite lanzar actualizaciones frecuentes con mayor calidad y menor riesgo operativo.",

  "Los tokens no fungibles o NFT representan propiedad digital unica sobre la cadena de bloques. Han abierto nuevos modelos de negocio para artistas y creadores de contenido en internet.",

  "La computacion en la nube permite acceder a recursos de procesamiento y almacenamiento de forma remota. Empresas de todos los tamanos se benefician de su flexibilidad y escalabilidad.",

  "Los algoritmos de recomendacion analizan el comportamiento del usuario para predecir sus preferencias. Esta tecnologia esta presente en plataformas de streaming, comercio y redes sociales.",

  "El codigo abierto permite que cualquier desarrollador estudie, modifique y distribuya software libremente. Este modelo colaborativo ha producido algunas de las herramientas mas importantes de internet.",

  "Las aplicaciones descentralizadas o dApps funcionan sobre redes blockchain sin un servidor central. Ofrecen mayor transparencia y resistencia a la censura comparadas con las aplicaciones tradicionales.",

  "La accesibilidad web garantiza que las personas con discapacidad puedan usar cualquier sitio digital. Implementar buenas practicas de accesibilidad tambien mejora el SEO y la usabilidad general.",

  "Los modelos de lenguaje grande son entrenados con millones de textos para generar respuestas coherentes. Su capacidad de razonamiento y generacion ha sorprendido a la comunidad cientifica mundial.",

  "La seguridad informatica protege los sistemas digitales frente a accesos no autorizados y ataques maliciosos. En la era de los datos, esta disciplina se vuelve cada vez mas critica y valorada.",

  "El prototipado rapido en diseno permite validar ideas con usuarios reales antes de construir el producto. Herramientas como Figma han democratizado este proceso para equipos de cualquier tamano.",

  "Las API REST permiten que distintas aplicaciones se comuniquen entre si de manera estandarizada. Son el puente que conecta frontends, backends y servicios externos en el ecosistema digital.",

  "La tokenizacion de activos permite representar bienes del mundo real dentro de la blockchain global. Desde inmuebles hasta obras de arte pueden fraccionarse y transarse digitalmente con seguridad.",

  "El edge computing procesa datos cerca de donde se generan en lugar de enviarlos a la nube central. Esta estrategia reduce la latencia y mejora el rendimiento de aplicaciones en tiempo real.",

  "Los sistemas multiagente en inteligencia artificial coordinan multiples agentes autonomos para resolver problemas. Esta tecnologia es clave en robotica, logistica y simulaciones complejas de entornos.",

  "El diseno centrado en el usuario parte de investigar necesidades reales antes de crear soluciones digitales. Entender al usuario evita construir productos que nadie quiere usar en la vida real.",

  "La infraestructura como codigo permite gestionar servidores y redes mediante archivos de configuracion versionados. Herramientas como Terraform hacen que los entornos sean reproducibles y auditables.",

  "Los grafos de conocimiento organizan informacion en forma de nodos y relaciones semanticas entre conceptos. Son la base de motores de busqueda inteligentes y sistemas de recomendacion avanzados."
];

export function getTextByIndex(index: number): string {
  return TYPING_TEXTS[index % TYPING_TEXTS.length];
}
