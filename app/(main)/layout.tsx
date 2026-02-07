import { Masthead } from "@/components/newspaper/masthead";
import { Ticker } from "@/components/newspaper/ticker";
import { Footer } from "@/components/newspaper/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Masthead />
      <Ticker />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
