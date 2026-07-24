"use client";

import Header from "./components/Header";
import ChatBox from "./components/ChatBox";
import AnCBackdrop from "./components/AnCBackdrop";

export default function Chat() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AnCBackdrop />
      <Header />
      <main className="flex min-h-0 flex-1 items-end justify-center gap-6 px-4 pb-8 sm:px-6 lg:px-8">
        <ChatBox />
      </main>
    </div>
  );
}