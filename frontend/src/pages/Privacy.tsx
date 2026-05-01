import { Header } from "@/components/Header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none text-foreground space-y-4">
          <p className="text-muted-foreground">Last updated: February 2026</p>
          
          <h2 className="text-xl font-semibold mt-6">1. Data Collection</h2>
          <p className="text-muted-foreground">CareerCompass collects minimal personal data. Your assessment responses, bookmarks, and roadmap progress are stored locally in your browser using localStorage.</p>
          
          <h2 className="text-xl font-semibold mt-6">2. Data Storage</h2>
          <p className="text-muted-foreground">All data is stored locally on your device. No data is transmitted to external servers. Clearing your browser data will remove all stored information.</p>
          
          <h2 className="text-xl font-semibold mt-6">3. Data Usage</h2>
          <p className="text-muted-foreground">Your assessment data is used solely to generate career recommendations using our deterministic scoring algorithm. We do not use AI or machine learning to process your data.</p>
          
          <h2 className="text-xl font-semibold mt-6">4. Third Parties</h2>
          <p className="text-muted-foreground">We do not share, sell, or transfer your personal information to any third parties.</p>
          
          <h2 className="text-xl font-semibold mt-6">5. Your Rights</h2>
          <p className="text-muted-foreground">You can delete all your data at any time by clearing your browser's localStorage. You have full control over your data.</p>
          
          <h2 className="text-xl font-semibold mt-6">6. Contact</h2>
          <p className="text-muted-foreground">For questions about this privacy policy, please contact the CareerCompass team.</p>
        </div>
      </div>
    </div>
  );
}
