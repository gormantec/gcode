export class Contract{

}
export interface ContractMethods {
    /**
     * Methods that change state. These methods cost gas and require a signed transaction.
     * 
     * @see {@link Account.functionCall}
     */
    changeMethods: string[];

    /**
     * View methods do not require a signed transaction.
     * 
     * @@see {@link Account.viewFunction}
     */
    viewMethods: string[];
}