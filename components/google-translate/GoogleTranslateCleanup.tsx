// components/google-translate/GoogleTranslateCleanup.tsx
"use client";

import { useEffect } from "react";

export default function GoogleTranslateCleanup() {
  useEffect(() => {
    const removeProblematicElements = () => {
      // Only remove the banner and top bar, NOT the dropdown functionality
      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner) {
        banner.remove();
      }

      // Remove the skiptranslate class that messes with body positioning
      document.body.classList.remove("skiptranslate");
      document.body.style.top = "0";

      // Remove the gadget but keep the dropdown functional
      const gadgets = document.querySelectorAll(".goog-te-gadget");
      gadgets.forEach((gadget, index) => {
        // Keep at least one gadget for functionality, remove extras
        if (index > 0) {
          gadget.remove();
        }
      });
    };

    // Run cleanup
    removeProblematicElements();

    // Set up observer for dynamic changes
    const observer = new MutationObserver((mutations) => {
      let shouldCleanup = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            const element = node as Element;
            if (
              element.classList?.contains("goog-te-banner-frame") ||
              element.classList?.contains("skiptranslate")
            ) {
              shouldCleanup = true;
            }
          }
        });
      });

      if (shouldCleanup) {
        removeProblematicElements();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Additional cleanup after delays
    const timeouts = [100, 500, 1000, 2000].map((time) =>
      setTimeout(removeProblematicElements, time)
    );

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return null;
}
