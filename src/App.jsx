import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CSVEditor } from "@/components/CSVEditor";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <CSVEditor />
  </TooltipProvider>
);

export default App;
