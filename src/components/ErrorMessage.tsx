import { ReactNode } from "react";

export const ErrorMessage: React.FC<{children: ReactNode}> = ({children}) => {
  return <h4 className="text-red-400 flex justify-center">{children}</h4>
};