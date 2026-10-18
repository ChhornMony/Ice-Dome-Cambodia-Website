import '../index.css';
import Providers from './providers';
import Footer from "@/components/common/footer";
import { Toaster } from "sonner";

export const metadata = {
  title: 'Ice Dome Cambodia',
  description: 'Ice Dome Cambodia booking and shop website',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Footer/>
      </body>
    </html>
  );
}
