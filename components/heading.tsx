type HeadingProps = {
  title: string;
  description: string;
}

export function Heading({ title, description }: HeadingProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
