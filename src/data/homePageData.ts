import {
    Briefcase,
    EyeOff,
    Heart,
    Lock,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    Star,
    User,
    Users,
    X, // Zap is imported but not used, can be removed if not needed later
} from "lucide-react";

export const useCases = [
    {
        id: 1,
        title: "Couples",
        description:
            "Share intimate moments and conversations without worrying about message history or screenshots.",
        gradient: "from-[#EC4899] to-[#A855F7]", // Replaced pink/purple names with hex/standard Tailwind colors
    },
    {
        id: 2,
        title: "New Connections",
        description:
            "Explore potential relationships in a space where you can be authentic without digital baggage.",
        gradient: "from-[#A855F7] to-[#3B82F6]", // Replaced purple/blue names with hex/standard Tailwind colors
    },
    {
        id: 3,
        title: "Private Discussions",
        description:
            "Have sensitive conversations that require discretion and complete privacy.",
        gradient: "from-[#14B8A6] to-[#3B82F6]", // Replaced teal/blue names with hex/standard Tailwind colors
    },
    {
        id: 4,
        title: "Digital Minimalists",
        description:
            "For those who prefer to live in the moment without creating permanent digital records.",
        gradient: "from-[#F97316] to-[#EC4899]", // Replaced orange/pink names with hex/standard Tailwind colors
    },
];

export const navLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features", label: "Features" },
    { href: "#faq", label: "FAQ" },
];

export const messages = [
    "Hey there... looking for someone to chat with?",
    "Hi! Yes, just wanting to connect without leaving a trace.",
    "Perfect! That's what Whispr is all about. No history, no records.",
    "Exactly what I needed. Let's chat...",
];

export const steps = [
    {
        icon: User,
        title: "Sign In Securely",
        description:
            "Quick authentication — we care about security, not your life story.",
        color: "purple",
        bgGradient: "from-purple-900/30 to-purple-600/10",
    },
    {
        icon: MessageCircle,
        title: "Start a Chat",
        description:
            "Connect with someone special for a conversation that stays in the moment.",
        color: "teal",
        bgGradient: "from-teal-900/30 to-teal-600/10",
    },
    {
        icon: X,
        title: "Leave No Trace",
        description:
            "When you're done, everything vanishes. What happens in Whispr, stays in Whispr.",
        color: "red",
        bgGradient: "from-red-900/30 to-red-600/10",
    },
];

export const features = [
    {
        id: 1,
        icon: EyeOff,
        title: "No Chat History",
        description:
            "Messages vanish once you close the chat — like writing in disappearing ink. Everything disappears when your session ends.",
        color: "#6200EA",
        animDelay: "0s",
    },
    {
        id: 2,
        icon: Lock,
        title: "End-to-End Encryption",
        description:
            "Your conversations are locked down tight. Only you and your partner have the key. Not even we can access them.",
        color: "#00BFA5",
        animDelay: "0.2s",
    },
    {
        id: 3,
        icon: Sparkles,
        title: "Spontaneous Connections",
        description:
            "Meet new people or connect with someone special in a space that encourages authentic, in-the-moment conversations.",
        color: "#6200EA",
        animDelay: "0.4s",
    },
    {
        id: 4,
        icon: Star,
        title: "Intuitive Experience",
        description:
            "Simple, clean interface focused on the conversation. No distractions, no complex features - just smooth, effortless communication.",
        color: "#00BFA5",
        animDelay: "0.6s",
    },
];
export const useCasesCarsole = [
    {
        id: 0,
        title: "Dating & Relationships",
        description:
            "Share intimate moments and conversations without worrying about message history affecting your relationship in the future.",
        icon: Heart,
        gradient: "from-purple-900 to-pink-700",
        iconColor: "#f472b6",
    },
    {
        id: 1,
        title: "Private Conversations",
        description:
            "Discuss sensitive topics with friends or family knowing your conversations remain completely private and temporary.",
        icon: Users,
        gradient: "from-blue-900 to-purple-800",
        iconColor: "#818cf8",
    },
    {
        id: 2,
        title: "Sensitive Discussions",
        description:
            "Share confidential information or get advice on personal matters without leaving a permanent record online.",
        icon: ShieldCheck,
        gradient: "from-emerald-900 to-teal-800",
        iconColor: "#34d399",
    },
    {
        id: 3,
        title: "Professional Use",
        description:
            "Conduct business conversations requiring confidentiality without concern for data retention or future leaks.",
        icon: Briefcase,
        gradient: "from-indigo-900 to-blue-800",
        iconColor: "#60a5fa",
    },
];

export const faqs = [
    {
        question: "How does Whispr protect my privacy?",
        answer:
            "Whispr employs end-to-end encryption for all communications, ensuring that only you and your intended recipients can access your messages. We don't store any message content on our servers once delivered, and we never sell or share your personal data with third parties.",
    },
    {
        question: "Can I use Whispr on multiple devices?",
        answer:
            "Yes, Whispr is designed for seamless multi-device usage. Your account can be synchronized across smartphones, tablets, and desktop computers, with all your settings and preferences maintained across devices.",
    },
    {
        question: "Is Whispr free to use?",
        answer:
            "Whispr offers a robust free tier with all essential communication features. For advanced features like increased file storage and premium integrations, we offer affordable subscription plans designed for both individual users and teams.",
    },
    {
        question: "How do I delete my account and data?",
        answer:
            "You can delete your account at any time through the Privacy settings in your profile. Upon deletion, all your personal information and message data are permanently removed from our systems within 30 days, in compliance with global data protection regulations.",
    },
    {
        question: "What makes Whispr different from other messaging apps?",
        answer:
            "Whispr combines industry-leading privacy protection with an intuitive user experience and powerful collaboration tools. Our unique approach to ephemeral messaging and AI-assisted communications sets us apart from traditional messaging platforms.",
    },
];

