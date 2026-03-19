"use client";

import { useEventModal } from "../hooks/useEventModal";
import { MobileShowcase } from "./MobileShowcase";
import { DesktopShowcase } from "./DesktopShowcase";
import { EventModal } from "./EventModal";

/**
 * CommunityShowcaseSection
 *
 * Top-level orchestrator for the Community Showcase page section.
 * Manages modal state and composes the mobile and desktop layouts.
 *
 * Sub-components:
 *   - MobileShowcase    — full mobile layout (below md breakpoint)
 *   - DesktopShowcase   — full desktop layout (md and above)
 *   - EventModal        — frosted-glass detail modal
 *
 * Hooks:
 *   - useEventModal     — two-phase mount + CSS transition state
 */
export function CommunityShowcaseSection() {
  const modal = useEventModal();

  return (
    <div className="relative overflow-hidden pt-32 pb-32 md:pt-60 md:pb-48 px-4 md:px-8 lg:px-16">
      <MobileShowcase />
      <DesktopShowcase onOpenModal={modal.openModal} />
      {modal.shouldRender && (
        <EventModal isVisible={modal.isVisible} onClose={modal.closeModal} />
      )}
    </div>
  );
}
