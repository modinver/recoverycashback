import { Link } from "react-router-dom";
import { useWebpageQuery } from "@/hooks/useWebpageQuery";

interface WebpageLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function WebpageLink({ to, children, className }: WebpageLinkProps) {
  const { prefetchWebpage } = useWebpageQuery(undefined);
  const slug = to.startsWith("/") ? to.slice(1) : to;

  const handleMouseEnter = () => {
    prefetchWebpage(slug);
  };

  return (
    <Link
      to={to}
      className={className}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </Link>
  );
}
