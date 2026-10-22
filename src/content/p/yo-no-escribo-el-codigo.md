---
title: Yo no escribo el código
description: >-
  Puse un juego de torres en la web en tres días y empecé un juego de espadas una semana después. Claude escribió cada línea. Esto es lo que hago yo.
pubDate: 2026-10-22T12:00:00-04:00
heroImage: /images/2026/devlog-1-collage.avif
imageAlt: 'Un collage de los dos juegos: la torre, los cuartos y el logo de Uplift en pixel art sobre un patio de tierra donde Milak blande una espada enorme entre ninjas vestidos de negro, un lobo, un goblin y utilería de práctica.'
language:
  - es
category:
  - learning-projects
  - art-expression
  - diy-creation
tags:
  - game-development
  - ai
  - ai-agents
  - creativity
  - craftsmanship
  - software-development
  - writing
  - art-expression
draft: false
featured: true
published: true
showComments: true
translationGroup: i-dont-write-the-code
---

Tengo un trabajo y una familia, y en los últimos diez días puse [un juego de torres en la web](https://uplifttowergame.com) y empecé a construir [un juego de espadas](https://www.patreon.com/c/antoniwan) en un game engine (motor de juegos) de verdad. No escribí ni una línea del código de ninguno de los dos. Lo escribió Claude, un AI (IA).

Mucha gente odia el AI en los juegos ahora mismo, y parte de ese odio se lo ganaron: hay [una avalancha de juegos en Steam](https://kotaku.com/steam-valve-slop-ai-genai-vibe-coding-pc-game-releases-2000746749) que alguien publicó pero que nadie parece haber dirigido, [juegos donde nadie tomó una decisión](https://www.pcgamer.com/gaming-industry/steam-week-in-review-steam-next-fest-has-over-8-000-demos-as-worthless-vibe-coded-slop-levels-up/) (los dos artículos están en inglés). Así que este devlog (diario de desarrollo) es sobre las decisiones que yo tomo mientras la máquina escribe.

Los tokens del AI se van a comprar y a usar de todas formas, así que voy a comprar algunos y hacer juegos brutales con ellos, a la vista de todos. Digo cuándo hay AI en el trabajo, tomo las decisiones, y entiendo lo que construye. El peligro que me preocupa no es alguien como yo haciendo juegos con eso. Es gente corriendo estos modelos sin los seguros puestos y sin nadie mirando.

## Los dos juegos

|                     | Uplift                                                                                  | Milak                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Qué es              | Un juego de construir torres, mi versión de SimTower                                    | Un RPG de acción en 3D: Milak Summir, un espadachín a sueldo                                |
| Cómo va             | Temprano y jugable: un vertical slice (una tajada completa del juego), en vivo y gratis | Un tramo de combate jugable: cuerpos desde el 20 de octubre, pantalla de título desde el 22 |
| Decisiones escritas | Más de 170                                                                              | Más de 200                                                                                  |
| Jugarlo             | [uplifttowergame.com](https://uplifttowergame.com)                                      | Todavía no. Apóyalo en [Patreon](https://www.patreon.com/c/antoniwan)                       |

## Uplift: en vivo en tres días

Uplift empezó el 11 de octubre con una sola oración, casi exacta: "i've always loved SimTower, let's build a worth web-based successor for it, let's create the project plan, let's define everything before building anything, help me out."

Definir todo antes de construir nada. Ese fue todo el método, y todavía lo es. Antes de cualquier código hubo preguntas, muchísimas, y cada respuesta que di se escribió con mis palabras y la fecha. Cuando el código y mis palabras no están de acuerdo, ganan mis palabras, y el código se arregla.

Tres días después de esa primera oración, Uplift estaba en vivo.

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-uplift-demo-tower.webp" alt="La torre de demostración de Uplift en juego: quince pisos de oficinas y hogares sobre dos sótanos, con los paneles de Torre, Objetivos, Construir y Mapa abiertos." width="1456" height="816" loading="lazy" decoding="async" />
  <figcaption>La torre de demostración de Uplift, en vivo en el navegador.</figcaption>
</figure>

Después un amigo lo jugó y me dijo que el primer minuto confundía: demasiados paneles, nada que hacer. Esa sola nota se convirtió en el nuevo comienzo del juego: un solar vacío, una sola instrucción, y los paneles aparecen solo cuando los necesitas. No se me ocurrió a mí. Solo escuché, y decidí que tenía razón.

Quiero más notas como esa, de más gente. Es la razón por la que escribo devlogs.

## Milak: el juego que llevo soñando

El experimento de la torre me dio el empujón, la confianza para seguir mis sueños, básicamente. Y que mis hijos disfruten mis demos es una sensación que no puedo explicar.

Y sí, llevo soñando con Milak desde la primera vez que jugué con Yasuo y Yone en League of Legends. Un RPG de acción basado nada más en la búsqueda de aprender combate y artes marciales, y de ir acumulando esa destreza y esa fuerza, para un juego sandbox (mundo abierto) de aventura bien divertido. ¡Y este personaje, nuestro héroe, es casero! ¡Lo único que le importa es comer comida sabrosa, la verdad!

Milak empezó la noche del 19 de octubre. Milak Summir es un nombre que he usado en mis partidas de RPG por años, quizás desde el Guild Wars original, y ahora es un espadachín a sueldo que mueve una espada bastarda de dos manos como si fuera un lápiz. Le dije a Claude, más o menos: tú lo construyes, no yo, yo dirijo el arte.

Y lo primero que dirigí fue nada de arte. Milak era una cápsula azul dándole a muñecos de paja hasta que la pelea se sintió bien en mis manos. Arte encima de una pelea que no es divertida es arte perdido, así que esperó. La pelea pasó esa prueba el 20 de octubre, y solo entonces llegaron los cuerpos. Creo que casi todo el trabajo es decidir qué no construir todavía.

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-plain-shapes.webp" alt="Un Milak temprano: una cápsula azul le pega a muñecos de paja." width="1280" height="560" loading="lazy" decoding="async" />
  <figcaption>Milak antes del arte: una cápsula azul, hasta que la pelea fue divertida.</figcaption>
</figure>

Dos días después, es otro juego. Milak tiene un cuchillo de caza en la Q, un salto de verdad que cae con la espada, sangre y cuerpos que se quedan, y muñecos que se rompen y se vuelven a levantar. El teclado entero está en pantalla como sus barras de acción. Tiene un Diario, una ventana de Destrezas, misiones que nacen de lo que hace, y una pantalla de título. Y el juego ya tiene un título provisional: Lifesworn.

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-bag-nightfell.webp" alt="El bolso de Milak organizado como su cuerpo, con Nightfell, una espada legendaria marcada como borrador, comparada con su espada sencilla: más probabilidad y daño de crítico, más daño de hoja y más velocidad." width="1280" height="720" loading="lazy" decoding="async" />
  <figcaption>22 de octubre: el bolso con forma de hombre, y Nightfell, una espada que todavía no se ha ganado.</figcaption>
</figure>

## Cómo dirijo a Claude

Mi regla desde el 14 de octubre: "anything visually, every pixel, every line in this game, is it intentional, is it helpful, does it provide value to the game? always"

Claude propone, mucho, y rápido. Casi todo mi tiempo se va en decir cuál de las tres opciones es el juego y cuáles dos no lo son. A veces ninguna lo es, y digo cuál es, con mis palabras torpes, como el tornado de la espada, que describí como un enrosque, un pisotón, tres tajos, y después un 360 que tira "a fucking tornado of dirt, blood, whatever was in that cone". Claude lo convirtió en un movimiento. Lo jugué, dije qué estaba mal, y lo intentamos otra vez.

La ciencia del swing lab (el laboratorio de tajos) es brillante. Claude construyó una herramienta que pone a Milak a hacer cada animación de espada, traza la punta de la hoja, y marca el momento del golpe, con un muñeco a un metro de él para tener escala. Descubrió que las animaciones estaban hechas para espadas de una mano: su hoja de 1.65 metros se metía en el piso. Así que ahora Milak empieza con una espada normal, y la grande se la gana más adelante.

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-swing-lab.webp" alt="Doce cuadros del swing lab: Milak levanta una espada negra enorme sobre su cabeza y la baja al lado de un cilindro de práctica, con el recorrido de la punta trazado en amarillo." width="1600" height="900" loading="lazy" decoding="async" />
</figure>

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-milak-grip-fix.webp" alt="Antes y después del arreglo del agarre: a la izquierda la espada de Milak cae inclinada al lado de su mano; a la derecha sale derecha de su puño en el golpe." width="1216" height="560" loading="lazy" decoding="async" />
  <figcaption>El arreglo del agarre del 21 de octubre, antes y después: ahora la espada se queda en el puño de Milak.</figcaption>
</figure>

Lo que el AI hace por mí es lo mismo que haría un estudio si yo tuviera el dinero para pagarle a uno para construir Milak.

Yo no escribo el código, pero entiendo el codebase, completito. Eso es parte de ser un game developer (desarrollador de juegos). Si no estás haciendo eso, ¿de verdad puedes decir que estás construyendo un juego, nada más por cómo se siente? ¿Cómo lo vas a mantener? Así es como yo lo puedo mantener.

## Los juegos escriben de vuelta

Uplift se convirtió en una herramienta para construir el mundo de una novela. Su torre vive en un mundo que llevo años escribiendo, y el 19 de octubre le dije a Claude: "If you write it into the game it becomes canon in the universe - think about that". Así que ahora funciona para los dos lados. Cuando el juego necesitó robots y animales, yo los escogí, y ahora existen en el mundo de la novela también. Ese mundo está tan lejos en el futuro que mucho de él es adivinanza, hasta para mí, y el juego me sigue haciendo preguntas que la novela nunca me hizo: quién camina por los pasillos de noche, qué vive bajo tierra, qué encuentras cuando escarbas. Una locura.

Milak puede que haga lo mismo desde el otro lado. La idea es que el juego lo tenga pensando mientras viaja, pensamientos y quizás poemas, y que el jugador los vaya guiando. Eso es escribir, dentro de un juego. Quizás un día se convierta en una historia por sí sola. Todavía no lo sé.

Yo ya tenía un lugar para escribir sobre los juegos. ¿Coincidencia, accidente o intención? Honestamente, un poco de cada una. Notes existía desde hace más de un año antes de estos juegos; esa parte es un accidente. El 7 de octubre, cuatro días antes de que empezara Uplift, escribí que todo lo que escribo iba a ser gratis y que la gente me podía apoyar en Patreon si quería; el momento es una coincidencia. Escribir estos devlogs aquí es la parte intencional.

## ¿Es slop?

Algunos de ustedes lo pueden considerar slop (bazofia), pero yo no estoy de acuerdo para nada. ¿Bajo qué estándar es slop un juego gratis, que es un WIP (trabajo en progreso), y que se está trabajando con dirección intencional?

Le estoy dando vueltas a la ética, a la moral, a los porqués y a los porqué-no de todo el debate de si el AI es arte o no. Escribí sobre eso en [Primera fila para el fin del mundo](https://notes.antoniwan.online/p/primera-fila-para-el-fin-del-mundo/), y todavía pienso lo mismo que pensaba entonces:

> Creo que puede que vayamos rumbo a una época dorada del arte. El AI aplana las curvas de aprendizaje, y eso podría sacar a relucir a los próximos Leonardos y Leonardas da Vinci.
>
> ¿Y el debate de si el arte hecho con AI es arte o no? Para mí es una bobería. Es una impresión. Sí, es arte. Una impresión puede ser de baja o de alta calidad, como cualquier otra impresión.
>
> Decir cómo se hizo debería importar, y entonces, la integridad de cada persona determina el valor de esa pieza de arte.

Merriam-Webster escogió "slop" como su [palabra del año 2025](https://techcrunch.com/2025/12/15/merriam-webster-names-slop-the-word-of-the-year/): contenido digital de baja calidad, producido casi siempre en cantidad por medio del AI. Simon Willison, el programador que ayudó a que la palabra pegara en 2024, [lo dice más corto](https://simonwillison.net/2024/may/8/slop): contenido de AI que nadie pidió y nadie revisó. Y mi propia versión, del mismo ensayo: la bazofia sigue siendo arte, nada más que chapucero.

¿Es de baja calidad? ¿Se hace en cantidad? ¿Alguien lo revisó?

- **Uplift.** Es un trabajo en progreso, así que partes están crudas, y yo sé cuáles: todavía no tiene sonido, las reglas de las escaleras no están bien, un solar vacío se ve igual que uno abandonado, y algunos botones están en el panel equivocado. También aguanta 60 frames por segundo con 15,000 personas en la torre, cada cambio tiene que pasar sus 311 tests antes de entrar, y cada una de sus más de 170 decisiones tiene mis palabras. Es un juego, no un montón. Y está revisado: yo lo juego, un amigo lo jugó y le cambió el primer minuto, y cada cambio pasa por mí.
- **Milak.** Tiene tres días, así que júzguenlo más adelante. Por ahora: era una cápsula azul hasta que la pelea fue divertida, y los cuerpos que llegaron después son modelos gratis hechos por una persona, [Quaternius](https://quaternius.com), no generados. Un juego. Nada recibió arte antes de pasar mi prueba.
- **Este post.** Claude escribió el primer borrador desde mis notas, y yo lo estoy reescribiendo. Según la prueba de Willison, no es slop: yo lo pedí, y estoy leyendo cada línea. Según la de Merriam-Webster, la calidad la juzgan ustedes, y eso va para los tres. Lo que sí puedo prometer es que una persona tomó cada decisión.

Según mis propios estándares morales y éticos, Anthropic es una compañía que yo estoy bien con usar y pagar, por cierto. Mi plan lo pago yo; nadie me patrocina. Si estoy equivocado sobre ellos, ¡¡déjenme una nota aquí abajo!!

## Los sombreros que me pongo

Hacer dos juegos sin un estudio, desde el 11 de octubre hasta hoy, es ponerse casi todos los sombreros.

| Rol                                   | Quién                                    | Cómo se ve                                                                                                                                                           |
| ------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Director creativo                     | Yo                                       | La visión de los dos juegos y la última palabra en cada decisión: más de 170 decisiones escritas en Uplift, más de 200 en Milak                                      |
| Diseñador de juego                    | Yo                                       | La cadena del tornado de la espada, la stamina (resistencia), el árbol de talentos de Milak, las estrellas y las cuadrillas de construcción de Uplift                |
| Director de arte                      | Yo                                       | El look "hand-painted, yet graphic" (pintado a mano, pero gráfico) de League para Milak, cada pixel ganándose su lugar, qué modelos y qué fonts (tipografías) entran |
| Constructor de mundo                  | Yo                                       | La torre de Uplift vive en un mundo que llevo años escribiendo para una novela                                                                                       |
| Ingeniero                             | Claude                                   | Cada línea de código: más de 300 commits en Uplift, casi 400 en Milak                                                                                                |
| Revisor del código                    | Yo                                       | Entiendo el codebase, completito                                                                                                                                     |
| Productor                             | Yo, con los planes de Claude             | Qué se construye ahora y qué espera, como las figuras simples hasta que la pelea fue divertida                                                                       |
| QA (control de calidad) y playtesting | Mis amigos, los tests de Claude y yo     | Mis amigos me mandan notas; yo juego los dos; Uplift tiene 311 tests que cada cambio tiene que pasar, y aguanta 60 fps con 15,000 personas                           |
| Artista 3D                            | Quaternius, y quizás tú                  | Los cuerpos, la ropa, los animales y el patio de Milak: modelos gratis hechos por una persona                                                                        |
| Sonido                                | Kenney por ahora, yo después             | Los sonidos temporeros de Milak son de Kenney; el sonido de Uplift espera por los míos                                                                               |
| Investigador                          | Claude                                   | La biblioteca de assets (recursos) para Milak, y los números del mercado con los que planifico                                                                       |
| Escritor y traductor                  | Claude hace el borrador, yo lo reescribo | Este devlog, en inglés y en español                                                                                                                                  |
| Mercadeo                              | Yo                                       | El soft launch (lanzamiento suave), este devlog, el canal Antonio Builds Games, la página de Patreon                                                                 |
| Comunidad                             | Yo                                       | Los enlaces para probar, un formulario anónimo que me guarda cada respuesta, y los comentarios aquí abajo                                                            |

Claude se pone el sombrero de ingeniero y ayuda con la investigación, los tests y los primeros borradores. Los demás son míos, o de la gente cuyos modelos y sonidos gratis están en Milak.

Si dibujas, modelas, animas o haces sonidos, y construir estos juegos conmigo te suena divertido, salúdame aquí abajo. En el peor de los casos, hacemos algo chévere juntos. En el mejor, así es como empieza un estudio de juegos chiquito, jajaja. Sin presión, te lo prometo. Ya me pongo suficientes sombreros para saber lo mucho que pesan.

## Lo que salió mal

No es magia y no es gratis. Claude recuerda cosas del engine que ya no existen, y me entero cuando el build se rompe. Se le acaba la cuota en medio de una buena semana. El primer empujón de Uplift me costó $250 en créditos y casi una semana entera de mi plan. Y soy nuevo haciendo juegos. Tengo gusto y tengo muchos años haciendo software, pero estoy aprendiendo el oficio de los juegos en público, aquí, y también me voy a equivocar en público.

## Lo que viene

<figure class="post-inline-figure post-inline-figure--center">
  <img src="/images/devlog-1-lifesworn-title.webp" alt="Una pantalla de título oscura que dice Lifesworn, con Play, Choose a place y Quit." width="1280" height="720" loading="lazy" decoding="async" />
  <figcaption>Al 22 de octubre, el juego abre con una pantalla de título, bajo su título provisional.</figcaption>
</figure>

Cada dos semanas voy a escribir uno de estos: qué se construyó, qué decidí, y en qué me equivoqué. Uplift ya se puede jugar, gratis, en tu navegador. Milak va a tener un demo gratis cuando la pelea sea algo de lo que esté orgulloso.

Si quieres seguir esto, te voy a pedir una sola cosa: [sígueme en Patreon, gratis](https://www.patreon.com/c/antoniwan), y te llega cada devlog por email cuando salga. Nunca anuncios. Solo los juegos y yo haciéndolos.

_Capturas: el demo en vivo de Uplift, 21 de octubre de 2026; las grabaciones y capturas del propio Milak, del 20 al 22 de octubre de 2026; el collage, 22 de octubre de 2026. Estado al 22 de octubre de 2026._
