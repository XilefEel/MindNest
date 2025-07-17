export const Footer = () => {
  return (
    <footer className="p-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} MindNest | v1.0.0 | Built with Tauri and
      React
    </footer>
  );
};
