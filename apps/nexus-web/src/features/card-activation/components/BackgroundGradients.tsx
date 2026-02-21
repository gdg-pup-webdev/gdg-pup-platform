/**
 * Background Gradients Component
 *
 * This component creates the animated gradient background effects
 * used in various parts of the app for visual appeal.
 */

import React from "react";

export const BackgroundGradients: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top-left purple gradient */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />

      {/* Bottom-right blue gradient */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]" />
    </div>
  );
};
