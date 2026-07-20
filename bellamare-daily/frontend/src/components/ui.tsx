import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>{children}</div>;
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-bold text-sea-900 mb-4">{children}</h1>;
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-lg font-medium text-sea-800 mb-2">{label}</span>
      {children}
      {hint && <span className="block text-sm text-sea-600 mt-1">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border-2 border-sea-200 px-4 py-3 text-lg focus:border-sea-500 outline-none ${props.className || ""}`}
    />
  );
}

export function Badge({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${className}`}>{children}</span>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-sea-200 border-t-sea-600 rounded-full animate-spin" />
    </div>
  );
}

export function Alert({ type = "error", children }: { type?: "error" | "success"; children: ReactNode }) {
  const cls = type === "error" ? "bg-red-50 border-red-300 text-red-800" : "bg-green-50 border-green-300 text-green-800";
  return <div className={`border-2 rounded-xl px-4 py-3 mb-4 text-lg ${cls}`}>{children}</div>;
}
