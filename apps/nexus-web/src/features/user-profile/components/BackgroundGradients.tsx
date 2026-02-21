/**
 * Animated background gradients for the profile page
 *
 * This component creates the same animated gradient effect used in other pages.
 * It provides a visually appealing background with smooth animations.
 */

import React from "react";

export function BackgroundGradients() {
  return (
    <>
      {/* Top-left gradient blob - Purple/Blue */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Bottom-right gradient blob - Blue/Green */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Center gradient blob - Purple/Pink */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
    </>
  );
}
