# Prueba Maquetadoción Web Responsive

## Datos de la candidata

- GitHub: [miryambathilde](https://github.com/miryambathilde)
- Repositorio: <https://github.com/miryambathilde/waveless>

## 1. Contexto y objetivo

Esta entrega corresponde a la maquetación de la **página de inicio (home)** de un sitio ficticio de viajes, tomando como base el diseño en Figma y los requisitos del reto:

- Diseño responsive (escritorio, tablet y móvil)
- HTML semántico
- CSS/SCSS organizado y mantenible (BEM)
- Interactividad en JavaScript/TypeScript
- Buenas prácticas de accesibilidad y calidad técnica

## 2. Stack y versiones

- **Angular**: `21.1.x`
- **Angular CLI**: `21.1.5`
- **TypeScript**: `~5.9.2`
- **SCSS (Sass)**: integrado en Angular CLI
- **Node.js**: LTS recomendado
- **npm**: `10.x` o superior

## 3. Decisiones técnicas (con motivos y alternativas)

### 3.1 ¿Por qué Angular para esta prueba?

**Decisión**: usar Angular como framework principal.

**Motivos**:

- Me permite trabajar con una arquitectura robusta y consistente desde el inicio.
- Favorece la separación clara por componentes (`layout`, `pages`, `shared`), algo clave en una prueba donde se evalúa organización.
- Angular CLI aporta flujo de trabajo estable para build, serving y testing sin configurar tooling manualmente.

**Ventajas frente a hacerlo en Vanilla JS/CSS**:

- Menos riesgo de desorden cuando la UI crece (estado, estructura y reutilización mejor definidos).
- Mayor mantenibilidad a medio plazo.
- Mejor escalabilidad si el proyecto evoluciona a más páginas/funcionalidades.

**Documentación**:

- Angular docs: <https://angular.dev/>
- Angular CLI: <https://angular.dev/tools/cli>
- Angular Style Guide: <https://angular.dev/style-guide>

### 3.2 ¿Por qué TypeScript en lugar de JavaScript puro?

**Decisión**: mantener TypeScript estricto en toda la capa de lógica.

**Motivos**:

- Tipado fuerte para evitar errores comunes en tiempo de desarrollo.
- Mejora de mantenibilidad y legibilidad en componentes interactivos (filtros, slider, popovers, overlays).
- Mejor experiencia de refactor con autocompletado y validación estática.

**Ventajas frente a JavaScript**:

- Menor probabilidad de errores de runtime por tipos inesperados.
- Refactorizaciones más seguras.
- Contratos de datos más claros entre componentes.

**Documentación**:

- TypeScript Handbook: <https://www.typescriptlang.org/docs/>
- TSConfig reference: <https://www.typescriptlang.org/tsconfig>

### 3.3 ¿Por qué SCSS en lugar de CSS plano?

**Decisión**: usar SCSS para estructurar estilos por tokens, base y componentes.

**Motivos**:

- Uso de variables/tokens para colores, tipografías y elevaciones.
- Nesting controlado para mantener BEM legible en componentes complejos.
- Mejor modularidad y reuso de estilos.

**Ventajas frente a CSS puro**:

- Reducción de hardcodes visuales.
- Mayor consistencia de diseño entre componentes.
- Mejor productividad en mantenimiento y evolución.

**Documentación**:

- Sass docs: <https://sass-lang.com/documentation/>
- BEM (referencia): <https://getbem.com/>

### 3.4 Decisiones de arquitectura Angular aplicadas

- **Standalone components** para reducir acoplamiento y mantener imports explícitos por componente.
- **`ChangeDetectionStrategy.OnPush`** para mejorar rendimiento y control del render.
- **Signals (`signal`, `computed`, `input`, `output`)** para estado local simple y predecible.
- **`NgOptimizedImage`** para optimización de imágenes estáticas relevantes.
- **Path aliases en TypeScript** (`@app`, `@shared`, `@pages`, etc.) para evitar rutas relativas largas y mejorar legibilidad.

**Documentación**:

- Standalone/components: <https://angular.dev/essentials/components>
- Signals: <https://angular.dev/guide/signals>
- Inputs/Outputs modernos: <https://angular.dev/guide/components/inputs> y <https://angular.dev/guide/components/outputs>
- NgOptimizedImage: <https://angular.dev/guide/image-optimization>
- Paths en TypeScript: <https://www.typescriptlang.org/tsconfig#paths>

## 4. Buenas prácticas aplicadas

- Código orientado a **claridad y mantenibilidad**.
- Nomenclatura **BEM** consistente en plantillas y SCSS.
- Estructura de estilos en capas:
  - `src/styles/tokens`
  - `src/styles/base`
  - `src/styles/components`
  - estilos por componente en `src/app/**`
- Separación de responsabilidades entre layout, página y componentes reutilizables.

## 5. Funcionalidad implementada

- Hero con slider y navegación
- Navbar desktop + menú móvil en overlay
- Panel de filtros (sticky en desktop + drawer en móvil/tablet)
- Grid de cards
- Popover de desglose de precio por card
- Footer responsive

## 6. Responsive

La home se adapta a los tres contextos requeridos:

- **Escritorio**
- **Tablet**
- **Móvil**

La adaptación se resuelve con breakpoints y ajustes por componente (navegación, filtros, cards y layout principal).

## 7. Accesibilidad

Se han aplicado prácticas de accesibilidad desde la implementación:

- Estructura semántica (`header`, `main`, `footer`, `nav`, `section`, `aside`, `article`)
- `skip-link` al contenido principal
- Gestión de foco y teclado en overlays/dialogs (`Escape`, focus trap, retorno de foco)
- Uso de atributos ARIA en interacciones clave

Auditoría técnica incluida en:

- [docs/accessibility-audit.md](docs/accessibility-audit.md)

**Referencia WCAG**:

- <https://www.w3.org/WAI/standards-guidelines/wcag/>

## 8. Instalación y ejecución en local

### 8.1 Clonar repositorio

```bash
git clone https://github.com/miryambathilde/waveless.git
cd wareless
```

### 8.2 Instalar dependencias

```bash
npm install
```

### 8.3 Levantar servidor de desarrollo

Opción con Angular CLI (abre navegador automáticamente):

```bash
npx ng serve -o
```

Opción equivalente con script del proyecto:

```bash
npm start
```

### 8.4 URL local

```text
http://localhost:4200
```

### 8.5 Comandos útiles

```bash
npm run build
npm test
npx ng version
```

## 9. Estructura principal

```text
src/
  app/
    layout/
    pages/home/
    shared/
      navbar/
      hero-slider/
      filters-panel/
      card/
      popover-price/
      footer/
      tag/
  styles/
    tokens/
    base/
    components/
docs/
  accessibility-audit.md
```

## 10. Comentarios finales para evaluación

- Esta solución está orientada a demostrar no sólo resultado visual, sino también **calidad técnica**, **coherencia de decisiones** y **mantenibilidad**.
- Las decisiones de framework/lenguaje/estilos se han tomado buscando equilibrio entre productividad, robustez y escalabilidad.
- La base queda preparada para crecer con nuevas páginas y nuevas variantes de componentes sin perder orden en el código.
