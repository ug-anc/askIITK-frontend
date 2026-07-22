import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export interface TeamMember {
  id: string;
  name: string;
  rollNumber: string;
  image: string;
  contact: string;
  email: string;
  github: string;
  quote: string;
}

function githubHandle(url: string): string {
  try {
    const handle = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
    return handle ? `@${handle}` : url;
  } catch {
    return url;
  }
}

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <img
        src={member.image}
        alt={member.name}
        className="h-36 w-36 rounded-full object-cover ring-4 ring-slate-50"
      />
      <div>
        <h3 className="text-base font-semibold text-slate-900">{member.name}</h3>
        <p className="text-xs font-medium text-slate-400">Roll No. {member.rollNumber}</p>
      </div>

      <p className="line-clamp-3 text-base italic leading-snug text-slate-600">
        &ldquo;{member.quote}&rdquo;
      </p>

      <div className="mt-auto flex w-full flex-col items-center gap-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <a
          href={member.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:underline"
        >
          <FontAwesomeIcon icon={faGithub} className="h-3 w-3" />
          {githubHandle(member.github)}
        </a>
      </div>
    </div>
  );
}
