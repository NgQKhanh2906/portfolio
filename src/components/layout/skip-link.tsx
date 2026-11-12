export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-fg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-fg"
    >
      Bỏ qua đến nội dung chính
    </a>
  );
}
