"use client";

import { useEventModal } from "../hooks/useEventModal";
import { MobileShowcase } from "./MobileShowcase";
import { DesktopShowcase } from "./DesktopShowcase";
import { EventModal } from "./EventModal";
import { useListEvents } from "@/features/events/hooks/useListEvents";
import { CommunityShowcaseSkeleton } from "./CommunityShowcaseSkeleton";

/**
 * CommunityShowcaseSection
 *
 * Top-level orchestrator for the Community Showcase page section.
 * Manages modal state and composes the mobile and desktop layouts.
 *
 * Sub-components:
 *   - MobileShowcase              — full mobile layout (below md breakpoint)
 *   - DesktopShowcase             — full desktop layout (md and above)
 *   - EventModal                  — frosted-glass detail modal
 *   - CommunityShowcaseSkeleton   — loading skeleton shown while events fetch
 *
 * Hooks:
 *   - useEventModal     — two-phase mount + CSS transition state
 */
export function CommunityShowcaseSection() {
  const modal = useEventModal();
  const { data, isLoading } = useListEvents(1, 20, {});
  const EVENTS = data ? [...data.data] : [];

  if (isLoading) {
    return <CommunityShowcaseSkeleton />;
  }

  return (
    <div className="relative overflow-hidden pt-32 pb-32 md:pt-60 md:pb-48 px-4 md:px-8 lg:px-16">
      <MobileShowcase events={EVENTS} />
      <DesktopShowcase onOpenModal={modal.openModal} events={EVENTS} />
      {modal.shouldRender && EVENTS.length > 0 && (
        <EventModal event={EVENTS[0]} isVisible={modal.isVisible} onClose={modal.closeModal} />
      )}
    </div>
  );
}
