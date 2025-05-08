import { PlaidLinkButton } from './_components/PlaidLinkButton';
import { BankAccountsList } from './_components/BankAccountsList';

export default function CardsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bank Accounts</h1>
      </div>
      
      <div className="mb-6">
        <PlaidLinkButton />
      </div>
      
      <BankAccountsList />
    </div>
  );
}
