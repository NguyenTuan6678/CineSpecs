import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} CineSpecs. All rights reserved.
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-full">
          <span>Cam kết phi thương mại & phi lợi nhuận</span>
          <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
        </div>
      </div>
    </footer>
  );
}
