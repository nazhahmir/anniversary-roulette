import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, Gift } from "lucide-react";

interface TimeUpModalProps {
  isOpen: boolean;
  finalPrize: string;
  onClose: () => void;
}

export default function TimeUpModal({ isOpen, finalPrize, onClose }: TimeUpModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl mx-auto w-[95vw] max-h-[90vh] overflow-y-auto bg-white" data-testid="time-up-modal">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <Clock className="text-red-600 pulse-heart" size={48} />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold text-dark-blue" data-testid="modal-title">
            Time's Up!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center" data-testid="modal-message">
            <div className="bg-gradient-to-r from-mint/20 to-sky/20 p-4 rounded-lg border border-mint/30 mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Gift className="text-coral" size={20} />
                <div className="text-lg font-semibold text-dark-blue">Your Anniversary Prize:</div>
              </div>
              <div className="text-lg font-bold text-coral break-words leading-relaxed">{finalPrize}</div>
            </div>
            <div className="text-gray-600 leading-relaxed">
              The timer ran out, but don't worry! The system has automatically selected a wonderful anniversary surprise for you.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center mt-6">
          <AlertDialogAction
            onClick={onClose}
            className="bg-coral hover:bg-pink-600 text-white px-8 py-3 text-lg font-bold rounded-xl"
            data-testid="button-close-time-up"
          >
            Claim Your Prize!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}