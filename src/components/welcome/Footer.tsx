export default function Footer() {
  return (
    <footer className="text-muted-foreground p-6 text-center text-sm">
      © {new Date().getFullYear()} MindNest | v1.0.0 | Built with Tauri and
      React
    </footer>
  );
}
