import ReactModal from "react-modal";
import { TransactionInfo } from "../../types/transaction-info";
import { TransactionTokens } from "../../types/transaction-tokens";
import LoadingModal from "./LoadingModal";
import TokenListModal from "./TokenListModal";

type FormWrapperProps = {
  title: "Send" | "Swap";
  loadingModalOpen: boolean;
  tokenListModalOpen: boolean;
  tokenListSecondModalOpen: boolean;
  isLoading: boolean;
  transactionInfo: TransactionInfo;
  closeLoadingModal: () => void;
  closeTokenListModal: () => void;
  selectToken?: (token: TransactionTokens) => void;
  selectTokenFrom?: (token: TransactionTokens) => void;
  selectTokenTo?: (token: TransactionTokens) => void;
  children: React.ReactNode;
};

const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  loadingModalOpen,
  tokenListModalOpen,
  tokenListSecondModalOpen,
  isLoading,
  transactionInfo,
  closeLoadingModal,
  closeTokenListModal,
  selectToken,
  selectTokenFrom,
  selectTokenTo,
  children,
}) => {
  return (
    <div className='flex items-center justify-center pt-10'>
      <div className='bg-gray-200 dark:bg-gray-700 w-[480px] lg:min-w-[480px] lg:w-2/5 rounded-3xl p-4'>
        <div className='px-2 font-semibold text-xl`,'>
          <div>{title}</div>
        </div>

        {children}

        <ReactModal
          isOpen={loadingModalOpen}
          onRequestClose={closeLoadingModal}
          style={modalStyle}
          ariaHideApp={false}
          bodyOpenClassName='overflow-hidden'
          overlayClassName='fixed bg-faded inset-0 z-50'>
          <LoadingModal isLoading={isLoading} transactionInfo={transactionInfo} />
        </ReactModal>

        <ReactModal
          isOpen={tokenListModalOpen}
          onRequestClose={closeTokenListModal}
          style={modalStyle}
          ariaHideApp={false}
          bodyOpenClassName='overflow-hidden'
          overlayClassName=' fixed bg-faded inset-0 z-50'>
          <TokenListModal
            selectToken={selectToken}
            selectTokenFrom={selectTokenFrom}
            closeModal={closeTokenListModal}
          />
        </ReactModal>

        <ReactModal
          isOpen={tokenListSecondModalOpen}
          onRequestClose={closeTokenListModal}
          style={modalStyle}
          ariaHideApp={false}
          bodyOpenClassName='overflow-hidden'
          overlayClassName=' fixed bg-faded inset-0 z-50'>
          <TokenListModal selectTokenTo={selectTokenTo} closeModal={closeTokenListModal} />
        </ReactModal>
      </div>
    </div>
  );
};

export default FormWrapper;

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "25rem",
    backgroundColor: "#13181f",
    border: ".2px solid grey",
    borderRadius: "20px",
    padding: 0,
  },
};
