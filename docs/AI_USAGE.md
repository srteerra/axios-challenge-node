# Documentación de uso de IA

> **Candidato/a:** completa esta plantilla. Es un **entregable obligatorio** del reto.
> No hay respuestas "correctas": queremos ver **cómo diriges y validas** a la IA.
> Sé honesto/a — un uso reflexivo suma mucho más que fingir que no la usaste.

---

## 1. Herramientas utilizadas

- Claude Code.
- Copilot (autocompletado).

## 2. ¿Cómo la usaste? (flujo general)

Uso la IA como acelerador, no como reemplazo de criterio.

Lo primero que hago es solicitar un resumen del flujo base y de la estructura del proyecto, de modo que pueda agrupar el contexto de manera rápida y partir desde ahí. Esto aplica tanto cuando el proyecto no tiene documentación como cuando sí la tiene (como fue este caso con el archivo `ARCHITECTURE.md`), apoyándome desde el inicio para entender cómo empezar a moverme.

También me ayuda a crear estructuras de funciones repetitivas y HTML/CSS, lo que me ahorra tiempo de escribir línea por línea. Sin embargo, por lo general siempre me tomo el tiempo de revisar lo que arroja la IA y aprender mucho de ahí.

Cuando hay algún concepto que no entiendo bien, prefiero detenerme y pedirle más detalles, ejemplos y referencias.

## 3. Prompts clave

_Comparte los 2–4 prompts que más impacto tuvieron. Puedes resumirlos._

### Prompt 1
```
Analiza esta estructura y genera un resumen del contexto que describa flujo, patrones y convenciones (por ejemplo: convención de escritura, constantes, utils, etc.). También devuelve los paths de los archivos relevantes para su reutilización y muéstrame ejemplos de (servicios/controladores/repositorios) donde hagan un uso real.
```
**Para qué lo usé / resultado:**
Para agrupar conceptos y el contexto general del proyecto. Así me ahorro la inspección archivo por archivo y sé desde dónde partir. Aun así, por lo general termino dando un repaso a los archivos de referencia que este prompt me retorna y, en consecuencia, también a sus archivos dependientes.

### Prompt 2
```
Para la implementación CREATE necesito un método por lotes o transacciones para la ejecución de múltiples inserts. Qué alternativa debería utilizar en el caso del modelo "Team", dado que necesito crear los "TeamMembers"? Dame un ejemplo, sus parámetros y una explicación paso a paso.
```
**Para qué lo usé / resultado:**
Este prompt lo utilicé para buscar la manera de implementar la creación de los TeamMembers sin comprometer la mutación entera, haciéndolo de forma segura mediante una transacción.

Lo hice porque, con base en mi experiencia, he utilizado métodos similares pero con un enfoque distinto (GCP/Firebase), y necesitaba una alternativa validada para los casos de uso donde la requería (create y update).

### Prompt 3
```
Revisa si ves problemas o puntos de limpieza de código: complejidad innecesaria, bugs potenciales, reutilización de código o malas prácticas.
```
**Para qué lo usé / resultado:**
Suelo ejecutar esto al término de un módulo o sección. De esta forma limpio el código e identifico qué partes podrían extraerse a una función independiente.

Como fue el caso de `resolveSpecies`, donde me apoyé en la IA para refactorizar de manera rápida, limpiar las dos funciones y minimizar el código repetido de forma segura.

## 4. Qué acepté, rechacé o corregí de la IA

_Lo más importante de este documento._ Da ejemplos concretos:

| Sugerencia de la IA | ¿Acepté / rechacé / corregí? | ¿Por qué? |
|---|---|---|
| `transactions` | Acepté | Porque era la implementación más segura para el caso de uso: al crear un Team también se crean los TeamMembers, y esto corre dentro de una transacción. De esta forma se cumple el principio de "todo o nada" y tengo el soporte del ROLLBACK. |
| Separación de la lógica del controller a un servicio | Rechacé | Preferí seguir la misma base de referencia del proyecto, tal como lo hace Favorites, donde la lógica vive en el controller. |
| `resolveSpecies` | Acepté | Necesitaba una refactorización de ambas funciones para evitar repetir código, y este método independiente me funcionó como patrón de diseño. |
| Mandar los pokémon como parámetro en objetos | Corregí / Rechacé | Fue una observación que me hizo al analizar los modelos que tenía preparados: al pasar al siguiente paso con los controllers, sugirió cambiar los parámetros de `<string o number>[]` a `object`. Si bien la sugerencia no está mal, opté por dejar preparada una validación y quedarme con el array de especies (pokemonName o pokemonId), ya que así es como lo espera `assertSpeciesExists`, además de ser la implementación más sencilla. |
| Implementar un formulario | Rechacé | Para este caso me hubiera gustado extenderlo más con alguna librería como react-hook-form y componentes aparte. Pero para cubrir la funcionalidad requerida sin sobre-extender la solución, propuse usar el método `prompt()` y así tomar los datos del usuario de manera rápida y sin extender más la UI (además soporta `defaults`, lo cual me sirve para el método UPDATE). |

## 5. Decisiones de diseño que tomaste tú

_¿Qué decidiste con tu propio criterio (y no delegaste a la IA)? Ej.: modelo de datos, cómo aplicar la regla de "sin duplicados", el status 404 vs 403 para ownership, etc._

- Creación de las funciones en el controlador `teams.controller.js`
    - Aplicar las validaciones en el controlador, en caso de una `badRequest`
- Devolución de resultados
- HTML/CSS sencillo para renderizar los datos
- Utilizar el método nativo `prompt()` para el ingreso o actualización de datos
- Alertas de confirmación para la eliminación de datos

## 6. ¿Dónde te falló o te "alucinó" la IA?

_Si detectaste código incorrecto, APIs inventadas, o sugerencias que no aplicaban al proyecto, cuéntalo. Detectar esto es una señal muy positiva para nosotros._

- Al implementar funcionalidad en el frontend, inventaba o se anticipaba con propiedades en los Teams que no correspondían, como `pokemonNickname` en TeamMembers o el campo `order` en Team. Son errores del autocompletado.
- Tendencia a agregar demasiado estilo en línea (`style={}`) en el frontend.
    - Esto pasa mucho al autocompletar HTML: se crea rápido el componente, pero muchas veces se sobrecomplica con líneas que no son necesarias.

## 7. ¿Qué harías distinto con más tiempo?

- La creación de componentes a partir de la página de Teams, de forma que tenga componentes atómicos para cada cosa (listas, formularios, toasts, alerts, dialogs, etc.)
    - Acá sería de ayuda la IA, creando estos componentes y refactorizando.
- Escritura de más tests enfocados a Teams, en este caso:
    - Duplicados
    - Valores / inputs fuera de lo esperado
    - Escenarios que uno no contempla, pero que la IA puede aportar como lista de casos
