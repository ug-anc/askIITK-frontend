import type { Metadata } from "next";
import Header from "../components/Header";
import AnCBackdrop from "../components/AnCBackdrop";
import TeamCard, { type TeamMember } from "../components/TeamCard";
import teamData from "@/data/team.json";

export const metadata: Metadata = {
  title: "Meet the Team — Ask IITK",
  description: "The team behind Ask IITK, built for IITK's Academic and Career Council.",
};

const team = teamData as TeamMember[];

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <AnCBackdrop />
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Meet the Team
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </main>
    </div>
  );
}
