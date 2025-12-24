import { createSignal, createMemo } from "solid-js";

const [isSliding, setIsSliding] = createSignal(false);
const [slideDirection, setSlideDirection] = createSignal<"in" | "out">("in");

/**
 * Utility to handle slide animations for page transitions.
 * Usage: const cls = slideClass(); then use cls() in JSX.
 */
export const useSlideTransition = () => {

    // Call this before navigation to trigger slide out
    const triggerSlideOut = () => {
        setSlideDirection("out");
        setIsSliding(true);
        // Wait for animation to finish before navigating
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setIsSliding(false);
                resolve();
            }, 300); // match animation duration
        });
    };

    // Call this after navigation to trigger slide in
    const triggerSlideIn = () => {
        setSlideDirection("in");
        setIsSliding(true);
        setTimeout(() => setIsSliding(false), 300);
    };

    // Factory that returns a reactive getter (memo) for the given CSS module
    const slideClass = () =>
        createMemo(() => {
            if (!isSliding()) return "";
            
            return slideDirection() === "in" ? 'slideIn' : 'slideOut';
        });

    return { triggerSlideOut, triggerSlideIn, slideClass, isSliding, slideDirection};
};