# Prueba Maquetadoción Web Responsive

## Datos de la candidata

- GitHub: [miryambathilde](https://github.com/miryambathilde)

## 1. Resumen del proyecto

Esta entrega corresponde a la maquetación de la **página de inicio (home)** de un sitio ficticio de viajes, siguiendo el diseño base en Figma y los criterios del reto:

- Diseño responsive (desktop, tablet y móvil)
- HTML semántico
- CSS/SCSS organizado con metodología BEM
- Interactividad en TypeScript
- Buenas prácticas de accesibilidad y mantenibilidad

## 2. Stack usado

- **Framework**: Angular 21 (standalone components)
- **Lenguaje**: TypeScript (modo estricto)
- **Estilos**: SCSS
- **Estado UI**: Signals (`signal`, `computed`, `input`, `output`)
- **Optimización de imágenes**: `NgOptimizedImage`

## 3. Decisiones técnicas y motivos de adopción

### 3.1 Angular standalone + OnPush

**Decisión**: trabajar con componentes standalone y `ChangeDetectionStrategy.OnPush`.

**Motivos**:

- reduce acoplamiento entre módulos y simplifica la estructura
- mejora rendimiento de renderizado en componentes de UI con muchos bloques repetidos (cards, filtros)
- hace más predecible el ciclo de actualización

**Resultado**:

- estructura más limpia, con imports explícitos por componente
- build estable y más fácil de escalar por features

### 3.2 Signals para estado de UI

**Decisión**: usar signals para estado local e interacciones (`filters`, menú móvil, drawer de filtros, slider, popovers).

**Motivos**:

- el estado es principalmente local de componente
- evita sobreingeniería de meter store global para un caso de maquetación
- facilita derivar estado con `computed` sin boilerplate

**Trade-off**:

- si en futuro la app crece con dominio complejo compartido entre muchas páginas, se puede complementar con store global.

### 3.3 Arquitectura de estilos por capas

**Decisión**: separar estilos en `tokens`, `base`, `components` y estilos de cada componente.

**Motivos**:

- centraliza decisiones visuales (colores, tipografías, sombras) en un único sitio
- reduce hardcodes y facilita cambios de branding
- mantiene consistencia entre componentes y estados

**Resultado**:

- colores/fuentes/sombras controlados por tokens semánticos
- menos riesgo de divergencias visuales entre bloques

### 3.4 BEM + anidado SCSS con `&`

**Decisión**: nomenclatura BEM estricta (`block__element--modifier`) y nesting con `&` en SCSS de componentes.

**Motivos**:

- mejora legibilidad y evita selectores ambiguos
- facilita mantenimiento cuando hay variantes y estados
- reduce colisiones de estilos entre componentes

**Resultado**:

- código más claro para evaluación técnica
- estilos de cada componente más fáciles de localizar y modificar

### 3.5 Accesibilidad desde la implementación (no solo visual)

**Decisión**: integrar accesibilidad en la estructura y en la interacción.

**Motivos**:

- el reto valora WCAG y funcionalidad real en distintos dispositivos
- overlays y drawers requieren gestión de foco para teclado

**Implementado**:

- landmarks semánticos (`header`, `main`, `footer`, `nav`, `section`, `aside`, `article`)
- `skip-link` a contenido principal
- dialogs con `role`, `aria-modal`, `aria-labelledby`/`aria-label`
- cierre con `Escape`
- foco inicial y retorno de foco al disparador
- focus trap en menú móvil y drawer de filtros

### 3.6 Path aliases en TypeScript

**Decisión**: configurar aliases en `tsconfig.json`.

**Motivos**:

- evita rutas relativas largas (`../../../../...`)
- mejora legibilidad y reduce errores al mover archivos
- hace más consistente la arquitectura por capas

**Aliases configurados**:

- `@app/*`
- `@layout/*`
- `@pages/*`
- `@shared/*`
- `@styles/*`
- `@assets/*`

## 4. Funcionalidades implementadas en la home

- Hero principal con slider y navegación
- Navbar desktop + menú móvil en overlay
- Panel de filtros (desktop sticky + drawer en tablet/móvil)
- Grid de cards
- Popover de desglose de precio por card
- Footer responsive

## 5. Responsive

La página se adapta a desktop, tablet y móvil con breakpoints y ajustes por componente:

- navegación
- filtros
- rejilla de cards
- layout general y jerarquía de contenido

## 6. Accesibilidad y validaciones

Se incluyó una auditoría técnica en:

- [docs/accessibility-audit.md](docs/accessibility-audit.md)

Checks incluidos:

- `alt`/`[alt]` en imágenes
- `type` en botones
- roles/ARIA en dialogs
- enlaces placeholder
- contraste en pares de color principales (validación orientativa WCAG)

## 7. Estructura principal

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

## 8. Instalación y ejecución local

### Requisitos

- Node.js (LTS recomendado)
- npm
- Angular CLI 21.1.5 (se puede usar vía `npx` sin instalación global)

### Versiones del proyecto

- Angular: `21.1.x`
- Angular CLI: `21.1.5`

### Pasos

1. Clonar el repositorio:

```bash
git clone 'https://github.com/miryambathilde/waveless'
cd waveless
```

1. Instalar dependencias:

```bash
npm install
```

1. Levantar entorno local:

```bash
npm start
```

1. Abrir:

```text
http://localhost:4200
```

### Verificación rápida del entorno (opcional)

```bash
node -v
npm -v
npx ng version
```

### Comandos útiles

```bash
npm run build
npm test
```

## 9. Comentarios adicionales para evaluación

- Se priorizó calidad técnica y coherencia en decisiones, no sólo resultado visual.
- La estructura está preparada para evolución futura (nuevas páginas, nuevos componentes, nuevos tokens).
- Se mantuvo foco en código limpio, legible y organizado, alineado con lo pedido en el enunciado.
