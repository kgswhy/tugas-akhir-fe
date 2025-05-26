import './globals.css';
import { Outfit } from 'next/font/google';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UrgentReminderProvider } from '@/context/UrgentReminderContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <UrgentReminderProvider>
              {children}
            </UrgentReminderProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}