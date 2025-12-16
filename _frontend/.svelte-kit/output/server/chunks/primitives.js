import { d as derived, w as writable } from "./index.js";
import { h as mockPrimitives } from "./mock-data.js";
const primitives = writable(mockPrimitives);
const selectedLanguage = writable("javascript");
const categories = [
  { id: "fundamentals", name: "Fundamentals", icon: "🎯", count: 6 },
  { id: "data-structures", name: "Data Structures", icon: "📊", count: 2 },
  { id: "advanced", name: "Advanced", icon: "🚀", count: 2 }
];
const supportedLanguages = [
  { id: "javascript", name: "JavaScript", icon: "🟨" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "go", name: "Go", icon: "🔵" },
  { id: "typescript", name: "TypeScript", icon: "🔷" },
  { id: "cpp", name: "C++", icon: "⚙️" }
];
derived(primitives, ($primitives) => {
  const byCategory = {};
  for (const primitive of $primitives) {
    if (!byCategory[primitive.category]) {
      byCategory[primitive.category] = [];
    }
    byCategory[primitive.category].push(primitive);
  }
  return byCategory;
});
export {
  supportedLanguages as a,
  categories as c,
  primitives as p,
  selectedLanguage as s
};
