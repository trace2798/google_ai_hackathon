interface HeadingProps {
  title: string;
  description?: string;
  subdescription?: string;
}

export const Heading = ({
  title,
  description,
  subdescription,
}: HeadingProps) => {
  return (
    <>
      <div className="flex mb-8 text-left  gap-x-3 mt-5">
        <div>
          <h2 className="text-3xl font-bold text-primary">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-sm text-muted-foreground">{subdescription}</p>
        </div>
      </div>
    </>
  );
};
