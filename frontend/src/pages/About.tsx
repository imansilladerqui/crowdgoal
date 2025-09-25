import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Github,
  Linkedin,
  Mail,
  ShieldCheck,
  Globe,
  Layers,
  RefreshCw,
  Users,
} from "lucide-react";
import { getWalletAddress } from "@/hooks/UseWalletStorage";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Fan-Powered & Secure",
    desc: "Every project is sports-focused. Smart contracts guarantee transparent funding and automatic refunds if goals aren’t met.",
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "Global Sports Community",
    desc: "Connect with fans worldwide, regardless of sport, team, or country.",
  },
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: "Decentralized & Transparent",
    desc: "No traditional backend. All project data and media stored on IPFS for trust and openness.",
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-primary" />,
    title: "Automatic Refunds",
    desc: "If a campaign fails, contributors get their funds back instantly.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Low Fees",
    desc: "Only 3% commission on successful campaigns, so more funds go directly to fan initiatives.",
  },
];

const techStack = [
  "Hardhat & Solidity (Smart Contracts)",
  "Next.js & React (Frontend)",
  "Tailwind CSS (UI)",
  "Wagmi & Viem (Blockchain Integration)",
  "IPFS (Decentralized Storage)",
  "The Graph (Optional Indexing)",
  "GitHub Actions (CI/CD)",
];

const About = () => {
  const { enableWalletDialog } = useWalletDialogs();

  const walletAddress = getWalletAddress();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-r from-primary/10 via-background to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              About CrowdGoal
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-8">
              CrowdGoal is the world’s first decentralized crowdfunding platform
              dedicated to empowering sports fans everywhere. Built on the
              Chiliz Network, CrowdGoal lets fans unite, fund, and bring to life
              the most exciting sports initiatives, fan experiences, and
              community-driven projects.
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <a
                href="https://github.com/imansilladerqui"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-8 w-8 text-foreground/60 hover:text-primary transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/imansilladerqui"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-8 w-8 text-foreground/60 hover:text-primary transition-colors" />
              </a>
              <a
                href="mailto:imansilladerqui@hotmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
              >
                <Mail className="h-8 w-8 text-foreground/60 hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl shadow-lg p-8 flex flex-col items-center text-center"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="py-16 bg-gradient-to-r from-background via-primary/5 to-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Architecture Overview
            </h2>
            <div className="max-w-3xl mx-auto bg-card rounded-xl shadow p-8">
              <pre className="text-left text-sm md:text-base text-foreground/80 whitespace-pre-wrap">
                {`monorepo/
│── contracts/   # Smart contracts (Hardhat)
│── frontend/    # Frontend (Next.js + Tailwind)
│── shared/abis/ # ABIs exported from Hardhat for the frontend

Data Flow:
1. Smart contracts handle the critical logic: goal, deadline, fundraising, refunds, and distribution.
2. The contract stores a metadataURI → points to a JSON on IPFS with visual data (title, description, image, docs).
3. The frontend listens to events → combines on-chain data (goal, raised, status) with IPFS metadata → renders project cards.`}
              </pre>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Tech Stack</h2>
            <ul className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-foreground/80">
              {techStack.map((tech, idx) => (
                <li key={idx} className="bg-card rounded-lg px-6 py-4 shadow">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-background to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to make sports history?
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Start a campaign, back a fan project, or join the global movement
              at CrowdGoal. For questions or collaborations,{" "}
              <a
                href="mailto:imansilladerqui@hotmail.com"
                className="text-primary underline"
              >
                email us
              </a>{" "}
              or connect on{" "}
              <a
                href="https://github.com/imansilladerqui"
                className="text-primary underline"
              >
                GitHub
              </a>{" "}
              or{" "}
              <a
                href="https://www.linkedin.com/in/imansilladerqui"
                className="text-primary underline"
              >
                LinkedIn
              </a>
              .
            </p>
            <a
              href="/create"
              className="inline-block px-8 py-4 bg-primary text-white rounded-full font-bold shadow hover:bg-primary/80 transition"
              onClick={(e) => {
                if (!walletAddress) {
                  e.preventDefault();
                  enableWalletDialog.show();
                }
              }}
            >
              Start a Project
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
