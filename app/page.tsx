import Home from "@/src/components/Pages/Home/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ilya Medvedev",
  description: "Fine Art Paintings & Drawings by Ilya Medvedev",
  icons: {
    icon: "/icon.svg", // Points to public/favicon.ico or app/favicon.ico
  },
};

export default function Page() {
  return <Home />;
}
