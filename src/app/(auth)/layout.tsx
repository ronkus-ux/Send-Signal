export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)]">
      {children}
    </div>
  );
}
