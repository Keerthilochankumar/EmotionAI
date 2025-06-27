import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "~/components/ui/menubar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EmotionBot - AI Chat Companion",
  description: "A mindful AI companion designed to support emotional well-being.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${GeistSans.variable} bg-gradient-to-br from-[#E6EAF0] via-[#DDE7F2] to-[#C1D1E8] antialiased`}
        >
          <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/40 bg-white/60 px-6 shadow-md backdrop-blur-md md:px-10">
            <h1 className="text-xl font-semibold tracking-wide text-[#506D84]">
              EmotionBot
            </h1>
            <Menubar className="border-none bg-transparent text-[#2F6B50]">
              <MenubarMenu>
                <MenubarTrigger>💬 Chat</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/chat?type=new">Start a New Chat</Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/chat?type=previous">Continue Previous Chat</Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link href="/chat?type=check-in">Daily Emotional Check-in</Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link href="/chat?type=meditation">Guided Meditation</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>🛟 Support</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/chat?type=therapist">Chat with AI Therapist</Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/support/affirmations">Daily Affirmations</Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link href="/support/forum">Community Forum</Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link href="/support/emergency">Emergency Support</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>😊 Mood</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/mood/track">Track My Mood</Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/mood/recommendations">Personalized Recommendations</Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link href="/mood/sounds">Relaxing Sounds</Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/mood/exercises">Mindfulness Exercises</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>⚙️ Settings</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/settings/personality">Customize AI Personality</Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Link href="/settings/theme">Theme Customization</Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link href="/settings/notifications">Notification Preferences</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <div className="flex items-center gap-4">
              <SignedOut>
                <div className="rounded-lg border border-[#829AB1] px-4 py-2 text-sm font-medium text-[#506D84] transition-all duration-300 hover:bg-[#E6EAF0]">
                  <SignInButton />
                </div>
                <div className="rounded-lg bg-[#829AB1] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#6E8CA7]">
                  <SignUpButton />
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main className="mt-16">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}