
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import FinalOutputPanel from '../FinalOutputPanel';

const FinalOutputButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="transition-all hover:shadow-glow">
            <FileText className="h-4 w-4 mr-2" />
            View Output
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <FinalOutputPanel />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="transition-all hover:shadow-glow w-full">
          <FileText className="h-4 w-4 mr-2" />
          View Output
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <div className="p-4">
          <h3 className="font-medium text-lg mb-4">Final Output</h3>
          <div className="max-h-[60vh] overflow-y-auto">
            <FinalOutputPanel />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinalOutputButton;
