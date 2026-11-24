import Link from "next/link";
import { clsx } from "clsx";

const variantStyles = {
  primary:
    "bg-gold text-black hover:bg-gold-light active:bg-gold-dark",
  ghost:
    "border border-white text-white hover:bg-white/10 active:bg-white/20",
  outline:
    "border border-gold text-gold hover:bg-gold hover:text-black active:bg-gold-dark",
  text: "text-gold underline underline-offset-4 decoration-gold/40 hover:decoration-gold",
};

const sizeStyles = {
  sm: "px-5 py-2 text-xs",
  md: "px-7 py-3 text-[0.8125rem]",
  lg: "px-9 py-4 text-sm",
};

type ButtonBaseProps = {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center font-body font-medium uppercase tracking-widest transition-all duration-300 cursor-pointer",
    variant !== "text" && "rounded-sm",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
