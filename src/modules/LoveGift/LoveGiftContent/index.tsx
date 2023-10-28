import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import Image from "next/image";
import { memo } from "react";

type BankAccountProps = {
  iconSrc: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
};

function BankAccount(props: BankAccountProps) {
  const i18n = useI18n();
  const { bankName, accountName, accountNumber, iconSrc } = props;

  const copyBankNumber = () => {
    navigator.clipboard.writeText(accountNumber);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        src={iconSrc}
        alt={`Bank logo of ${bankName}`}
        width={65}
        height={46}
      />
      <div className="text-center">
        <div>{accountNumber}</div>
        <div>{accountName}</div>
      </div>

      <PrimaryButton onClick={copyBankNumber} className="mt-2">
        {i18n.t("label_copy_account")}
      </PrimaryButton>
    </div>
  );
}

const MemoizedBankAccount = memo(BankAccount);

export function LoveGiftContent() {
  const i18n = useI18n();

  return (
    <>
      <MemoizedBankAccount
        accountName={i18n.t("label_bank_name_nadia")}
        accountNumber={i18n.t("label_bank_account_nadia")}
        bankName="BCA"
        iconSrc="/images/ic_bca_bank_logo.png"
      />
      <div className="mb-12" />
      <MemoizedBankAccount
        accountName={i18n.t("label_bank_name_wisnu")}
        accountNumber={i18n.t("label_bank_account_wisnu")}
        bankName="BCA"
        iconSrc="/images/ic_bca_bank_logo.png"
      />
    </>
  );
}
