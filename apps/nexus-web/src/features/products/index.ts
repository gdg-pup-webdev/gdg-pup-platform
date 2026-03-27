/**
 * Products Feature Module
 *
 * Exports all components needed to render the products page and team sub-pages.
 *
 * Internal structure:
 *   components/
 *     products-section/   — ResourceLibraryGrid, GdgProductsGrid, TiltCard, products.data.ts
 *     team-section/       — TeamHero, StudyJamsGrid
 *     team-structure-section/ — TeamLeadsGrid, TeamStructureDropdowns, team-members.data.ts
 *     (shared)            — AboutTheTeam, StudyJamContainer, TeamDropdowns
 */

export { ProductsSection } from "./components/ProductsSection";
export { TeamSection } from "./components/TeamSection";
export { TeamStructureSection } from "./components/TeamStructureSection";
