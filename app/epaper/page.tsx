import Header from "@/components/header";
import EPaperSection from "@/components/e-paper-section";
import Footer from "@/components/footer";

export default function EPaperPage() {
  return (
    <main>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <EPaperSection front={false} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
