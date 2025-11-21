import { Category } from "@/types";
import Colors from "./Colors";

export const defaultCategories: Category[] = [
  {
    id: "alimentation",
    name: "Alimentation",
    icon: "🍕",
    color: Colors.categories.alimentation,
    isActive: true,
  },
  {
    id: "transport",
    name: "Transport",
    icon: "🚗",
    color: Colors.categories.transport,
    isActive: true,
  },
  {
    id: "logement",
    name: "Logement",
    icon: "🏠",
    color: Colors.categories.logement,
    isActive: true,
  },
  {
    id: "loisirs",
    name: "Loisirs",
    icon: "🎮",
    color: Colors.categories.loisirs,
    isActive: true,
  },
  {
    id: "sante",
    name: "Santé",
    icon: "💊",
    color: Colors.categories.sante,
    isActive: true,
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛍️",
    color: Colors.categories.shopping,
    isActive: true,
  },
  {
    id: "voyage",
    name: "Voyage",
    icon: "✈️",
    color: Colors.categories.voyage,
    isActive: true,
  },
  {
    id: "education",
    name: "Éducation",
    icon: "📚",
    color: Colors.categories.education,
    isActive: true,
  },
  {
    id: "services",
    name: "Services",
    icon: "💼",
    color: Colors.categories.services,
    isActive: true,
  },
  {
    id: "autres",
    name: "Autres",
    icon: "📦",
    color: Colors.categories.autres,
    isActive: true,
  },
];
