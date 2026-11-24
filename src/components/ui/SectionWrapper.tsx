import { clsx } from "clsx";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
  id?: string;
  dark?: boolean;
  stone?: boolean;
}

export default function SectionWrapper({
  children,
  className,
  as: Tag = "section",
  id,
  dark,
  stone,
}: SectionWrapperProps) {
  return (
    <Tag
      id={id}
      className={clsx(
        "py-section",
        dark && "bg-black text-offwhite",
        stone && "bg-stone",
        !dark && !stone && "bg-offwhite",
        className,
      )}
    >
      <div className="mx-auto max-w-[80rem] px-6">{children}</div>
    </Tag>
  );
}
