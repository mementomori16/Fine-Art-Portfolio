import Home from "@/src/components/Pages/Home/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ilya Medvedev | Fine Art Gallery",
  description: "Fine Art Paintings & Drawings by Ilya Medvedev",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Ilya Medvedev | Fine Art Gallery",
    description: "Explore original fine art paintings and drawings by Ilya Medvedev.",
    url: "https://ilyamedvedev.com",
    siteName: "Ilya Medvedev",
    images: [
      {
        // Replace this with the URL of your best/most representative painting
        url: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg",
        width: 1200,
        height: 630,
        alt: "Fine Art by Ilya Medvedev",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ilya Medvedev | Fine Art Gallery",
    description: "Explore original fine art paintings and drawings by Ilya Medvedev.",
    images: ["https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg"],
  },
};

export default function Page() {
  return <Home />;
}