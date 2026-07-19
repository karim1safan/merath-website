import { RouterProvider, createMemoryRouter } from "react-router";
import { router, routes } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}

function PageWrapper({ path }: { path: string }) {
  const r = createMemoryRouter(routes, { initialEntries: [path] });
  return <RouterProvider router={r} />;
}

export function الرئيسية() { return <PageWrapper path="/" />; }
export function القرآن() { return <PageWrapper path="/quran" />; }
export function الأذكار() { return <PageWrapper path="/adhikr" />; }
export function السيرة() { return <PageWrapper path="/seerah" />; }
export function الشخصيات() { return <PageWrapper path="/personalities" />; }
export function الكويز() { return <PageWrapper path="/categories" />; }
export function الإحصائيات() { return <PageWrapper path="/statistics" />; }
export function المحفوظات() { return <PageWrapper path="/bookmarks" />; }
export function التحديالیومي() { return <PageWrapper path="/daily" />; }
export function البحث() { return <PageWrapper path="/search" />; }
export function مواقيتالصلاة() { return <PageWrapper path="/prayer" />; }
