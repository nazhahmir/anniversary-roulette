import { DollarSign, Heart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface CashOutModalProps {
  isOpen: boolean;
  prizeText: string;
  remainingTries: number;
  onCashOut: () => void;
  onContinue: () => void;
}

export default function CashOutModal({
  isOpen,
  prizeText,
  remainingTries,
  onCashOut,
  onContinue,
}: CashOutModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onContinue()}>
      <AlertDialogContent className="max-w-md" data-testid="cash-out-modal">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-coral to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="text-white" size={40} />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold text-dark-blue" data-testid="modal-title">
            Deal or No Deal?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3" data-testid="modal-message">
            <div className="bg-gradient-to-r from-mint/20 to-sky/20 p-4 rounded-lg border border-mint/30">
              <p className="text-lg font-semibold text-dark-blue">You revealed:</p>
              <p className="text-xl font-bold text-coral">{prizeText}</p>
            </div>
            <p className="text-gray-600">
              You have <span className="font-bold text-coral">{remainingTries}</span> {remainingTries === 1 ? 'try' : 'tries'} remaining.
            </p>
            <p className="text-gray-600">
              Do you want to <span className="font-bold">cash out</span> with this prize, or <span className="font-bold">continue playing</span> for a chance at something better?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-3">
          <AlertDialogAction 
            onClick={onCashOut}
            className="flex-1 bg-coral hover:bg-pink-600 text-white font-bold py-3"
            data-testid="button-cash-out"
          >
            <DollarSign className="mr-2" size={16} />
            Cash Out (Take This Prize)
          </AlertDialogAction>
          <AlertDialogCancel 
            onClick={onContinue}
            className="flex-1 bg-mint hover:bg-teal-600 text-white border-0 font-bold py-3"
            data-testid="button-continue"
          >
            No Deal (Keep Playing)
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}