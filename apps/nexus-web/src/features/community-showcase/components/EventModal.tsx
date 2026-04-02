"use client";

import { Event } from "@/features/events";

/**
 * EventModal
 *
 * Frosted-glass desktop modal for the featured event description.
 * Animation (mount/unmount + CSS transition) is controlled externally
 * via the `isVisible` prop — use the `useEventModal` hook.
 */

interface EventModalProps {
  isVisible: boolean;
  onClose: () => void;
  event: Event;
}

export function EventModal({ isVisible, onClose, event }: EventModalProps) {
  return (
    <>
      {/* Backdrop with blur and darken, animated */}
      <div
        className="fixed inset-0 z-100 transition-all duration-800"
        onClick={onClose}
        style={{
          background: isVisible
            ? "rgba(0,0,0,0.6)"
            : "rgba(0,0,0,0)",
          backdropFilter: isVisible ? "blur(12px)" : "blur(0px)",
          WebkitBackdropFilter: isVisible ? "blur(12px)" : "blur(0px)",
          transition:
            "background 800ms cubic-bezier(0.22,1,0.36,1), backdrop-filter 800ms cubic-bezier(0.22,1,0.36,1), -webkit-backdrop-filter 800ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Dialog panel */}
      <div
        className="fixed inset-0 z-101 flex items-center justify-center px-4 pointer-events-none"
        style={{
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(calc(100vh + 120px)) scale(0.98)",
          opacity: isVisible ? 1 : 0,
          transition:
            "transform 800ms cubic-bezier(0.22,1,0.36,1), opacity 500ms ease",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="relative w-full max-w-275 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient border ring */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              padding: "2px",
              background:
                "linear-gradient(135deg, #EA4335, #F9AB00, #34A853, #4285F4)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Frosted content */}
          <div
            className="relative flex items-center justify-center gap-2.5 rounded-2xl p-9"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(70px) saturate(180%)",
              WebkitBackdropFilter: "blur(70px) saturate(180%)",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center overflow-hidden"
            >
              ✕
            </button>

            {/* Body text */}
            <div
              className="flex-1 text-lg leading-7 text-white"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition:
                  "opacity 700ms ease 80ms, transform 800ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {
                event.description
              }
              {/* Join us for an empowering session on February 27, 2026, from 8:00
              PM to 9:30 PM, as we delve into the world of intermediate UI/UX
              design! In the &quot;Interactive UI/UX Design Bootcamp,&quot;
              we&apos;ll transform your ideas into reality by guiding you through
              the creation of both low- and high-fidelity wireframes. Learn how
              to turn these wireframes into interactive prototypes to showcase
              real user flows. We&apos;ll introduce key Figma features like Auto
              Layout and Components that boost design efficiency and maintain
              consistency. To top it all off, engage in our &quot;Hero Maker:
              Proto-Design Challenge,&quot; a mini design task where you can
              apply what you&apos;ve learned. Become part of the design
              revolution and elevate your skills with GDG PUP! Don&apos;t miss
              this opportunity to enhance your design capabilities. Book your
              seat today and bring your vision to life! */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
