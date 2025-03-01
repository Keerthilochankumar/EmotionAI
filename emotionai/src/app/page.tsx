"use client";

import { Meteors } from "~/components/magicui/meteors";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { motion } from "framer-motion";
import {
  Terminal,
  AnimatedSpan,
  TypingAnimation,
} from "~/components/magicui/terminal";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isTerminalLoaded, setIsTerminalLoaded] = useState(false);

  useEffect(() => {
    // Timeline:
    // 1. Main component animates in (takes ~1.2s)
    // 2. After 1.5s, main component slides down and terminal slides in (0.8s)
    // 3. After animation completes, terminal content loads
    const animationTimer = setTimeout(() => {
      setIsTerminalVisible(true);
      setTimeout(() => {
        setIsTerminalLoaded(true);
      }, 800); // Load terminal content after animation
    }, 1500); // Start animation after main component is fully visible

    return () => clearTimeout(animationTimer);
  }, []);

  // Animation variants for main component (slides down)
  const mainVariants = {
    initial: { y: 0 },
    animate: { 
      y: "100%", // Slide down just enough to reveal terminal fully
      transition: { 
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        when: "beforeChildren",
      }
    }
  };

  // Animation variants for terminal (slides in from top)
  const terminalVariants = {
    initial: { y: "-100vh", opacity: 0 },
    animate: { 
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        delay: 0.1 // Slight stagger after main component moves
      }
    }
  };

  return (
    <>
      <SignedOut>
        <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-br from-[#D4EDDA] via-[#A8D5BA] to-[#76C893] min-h-[150vh]">
          {/* Increased min-height to accommodate full main component and space */}
          <Meteors number={60} />

          {/* Terminal Component - Slides in from top */}
          <motion.div
            variants={terminalVariants}
            initial="initial"
            animate={isTerminalVisible ? "animate" : "initial"}
            className="absolute top-12 z-20 w-full flex justify-center"
          >
            <Terminal 
              className="rounded-xl border border-white/50 bg-white/90 p-6 shadow-2xl backdrop-blur-lg w-full max-w-3xl transform transition-all duration-300 hover:shadow-[0_0_30px_#A8D5BA]"
            >
              {isTerminalLoaded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <AnimatedSpan delay={0} className="text-grey-600 font-mono">
                    <span>✔ Initializing Next.js...</span>
                  </AnimatedSpan>
                  <AnimatedSpan delay={300} className="text-grey-600 font-mono">
                    <span>✔ Loading UI Components...</span>
                  </AnimatedSpan>
                  <AnimatedSpan delay={600} className="text-grey-600 font-mono">
                    <span>✔ Authenticating with Clerk...</span>
                  </AnimatedSpan>
                  <AnimatedSpan delay={900} className="text-grey-600 font-mono">
                    <span>✔ Configuring Emotion AI...</span>
                  </AnimatedSpan>
                  <AnimatedSpan delay={1200} className="text-grey-600 font-mono">
                    <span>✔ Activating Detection...</span>
                  </AnimatedSpan>
                  <AnimatedSpan delay={1500} className="text-grey-600 font-mono">
                    <span>✔ Processing NLP...</span>
                  </AnimatedSpan>
                  <AnimatedSpan delay={1800} className="text-grey-600 font-mono">
                    <span>✔ Connecting to AI Core...</span>
                  </AnimatedSpan>
                  <AnimatedSpan delay={2100} className="text-red-500 font-mono">
                    <span>ℹ System Online</span>
                  </AnimatedSpan>
                  <TypingAnimation delay={2400} className="text-green-400 font-mono text-lg">
                    EmotionBot: Ready to assist you!
                  </TypingAnimation>
                </motion.div>
              )}
            </Terminal>
          </motion.div>

          {/* Main Component - Slides down, remains fully visible */}
          <motion.div
            variants={mainVariants}
            initial="initial"
            animate={isTerminalVisible ? "animate" : "initial"}
            className="relative z-10 w-full flex justify-center pt-12"
          >
            <motion.div
              className="max-w-3xl space-y-8 rounded-2xl border border-white/40 bg-white p-10 text-center shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, y: -100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.6, -0.05, 0.01, 0.99],
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
            >
              <motion.h1
                className="text-6xl font-extrabold tracking-tight text-[#2F6B50] drop-shadow-md"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Meet EmotionBot
              </motion.h1>
              <motion.p
                className="text-xl text-[#3E8E67] font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                Your mindful AI companion for emotional support in a serene space.
              </motion.p>
              <motion.div
                className="flex justify-center gap-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
              >
                <motion.button
                  className="rounded-lg bg-[#3E8E67] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#2F6B50] hover:shadow-[0_0_25px_#A8D5BA]"
                  whileHover={{ scale: 1.15, rotate: 3, boxShadow: "0 0 25px rgba(168, 213, 186, 0.8)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
                <motion.button
                  className="rounded-lg border-2 border-[#3E8E67] px-8 py-4 text-lg font-semibold text-[#2F6B50] bg-transparent transition-all duration-300 hover:bg-[#D4EDDA] hover:shadow-[0_0_20px_#A8D5BA]"
                  whileHover={{ scale: 1.15, rotate: -3, boxShadow: "0 0 20px rgba(168, 213, 186, 0.8)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.8,
                  type: "spring",
                  stiffness: 120,
                  damping: 12,
                }}
              >
                <Card className="mt-8 border border-white/50 bg-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_#A8D5BA]">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl text-[#2F6B50] font-bold">
                      Chat with EmotionBot
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Spacer at the bottom */}
          <div className="h-32 w-full" /> {/* Adds space at the end */}
        </div>
      </SignedOut>
      <SignedIn>
        <RedirectToSignIn redirectUrl="/chat" />
      </SignedIn>
    </>
  );
}