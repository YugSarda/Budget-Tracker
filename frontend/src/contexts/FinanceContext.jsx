// import { createContext, useState, useContext } from "react";

// const FinanceContext = createContext();

// export function FinanceProvider({ children }) {
//   const [transactionsUpdated, setTransactionsUpdated] = useState(0);

//   const refreshTransactions = () => {
//     setTransactionsUpdated(prev => prev + 1);
//   };

//   return (
//     <FinanceContext.Provider value={{ transactionsUpdated, refreshTransactions }}>
//       {children}
//     </FinanceContext.Provider>
//   );
// }

// export  function useFinance() {
//   return useContext(FinanceContext);
// }