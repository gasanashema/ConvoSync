import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Shield,
  Globe,
  Zap,
  Moon,
  Sun,
  ArrowRight,
  Share2,
  Instagram,
  Linkedin,
} from "lucide-react";

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white transition-colors duration-300 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-gray-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">ConvoSync</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 -right-64 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 is now live
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
            >
              Connect Instantly, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Sync Seamlessly
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Experience the future of communication with adaptive real-time
              chat, prioritized messaging, and robust offline support designed
              for modern teams.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-semibold rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 group"
              >
                Start Chatting Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:h-[600px] w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-4">
              {/* Mock Chat Interface */}
              <div className="h-full bg-white dark:bg-slate-950 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      JD
                    </div>
                    <div>
                      <div className="font-semibold text-sm">John Doe</div>
                      <div className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
                        Online
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm max-w-[80%] border border-gray-100 dark:border-slate-800">
                      Hey! Have you seen the new ConvoSync update? 🚀
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-md shadow-primary/10 text-sm max-w-[80%]">
                      Yeah! The new animations are silky smooth.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm max-w-[80%] border border-gray-100 dark:border-slate-800">
                      And the offline mode is a game changer for my commute!
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-slate-900">
                  <div className="h-10 bg-gray-100 dark:bg-slate-900 rounded-full w-full"></div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -right-12 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold">Ultra Fast</div>
                  <div className="text-xs text-slate-500">
                    &lt; 50ms Latency
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-32 -left-12 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Shield size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold">E2E Encrypted</div>
                  <div className="text-xs text-slate-500">
                    Secure by default
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose ConvoSync?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built for speed, security, and reliability. We've thought of
              everything so you don't have to.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-blue-500" />}
              title="Real-Time Sync"
              description="Instant messaging with ultra-low latency, powered by advanced WebSocket technology globally."
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Offline Capable"
              description="Never lose a message. Send while offline, and we'll automatically sync whenever you reconnect."
              delay={0.2}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-green-500" />}
              title="Smart Priority"
              description="Urgent messages get delivered first. Smart notifications ensure you only see what matters."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              ConvoSync &copy; {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex gap-6 text-gray-500 dark:text-gray-400">
            <a
              href="https://linktr.ee/Shema_philbert"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Share2 />
            </a>
            <a
              href="https://instagram.com/gasana_sh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Instagram />
            </a>
            <a
              href="https://www.linkedin.com/in/shema-philbert"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Linkedin />
            </a>
          </div>

          <div className="text-gray-500 dark:text-gray-400 text-sm">
            Designed by{" "}
            <a
              href="https://linktr.ee/Shema_philbert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Shema
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
  >
    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default LandingPage;
