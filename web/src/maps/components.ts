export interface ComponentName {
    path: Record<string, string>;
    interface: Record<string, string>;
}

export const components: Record<
    string,
    ComponentName
> = {
    ANCV: {
        path: { "5.52.0": "packages/lib/src/components/ANCV/ANCV.tsx", "6.0.0": "packages/lib/src/components/ANCV/types.ts" },
        interface: { "5.52.0": "ANCVProps" }
    },
    Ach: {
        path: { "3.14.0": "packages/lib/src/components/Ach/components/AchInput/defaultProps.ts", "5.24.0": "packages/lib/src/components/Ach/types.ts" },
        interface: { "3.14.0": "default", "5.24.0": "ACHInputProps" }
    },
    AmazonPay: {
        path: { "3.20.0": "packages/lib/src/components/AmazonPay/types.ts" },
        interface: { "3.20.0": "AmazonPayElementProps", "6.0.0": "AmazonPayConfiguration" }
    },
    ApplePay: {
        path: { "3.10.0": "src/components/ApplePay/types.ts", "3.14.0": "packages/lib/src/components/ApplePay/types.ts" },
        interface: { "3.10.0": "ApplePayElementProps", "6.0.0": "ApplePayConfiguration" }
    },
    Atome: {
        path: { "6.13.0": "packages/lib/src/components/Atome/types.ts" },
        interface: { "6.13.0": "AtomeConfiguration" }
    },
    BacsDD: {
        path: { "3.19.0": "packages/lib/src/components/BacsDD/components/types.ts", "6.0.0": "packages/lib/src/components/BacsDD/types.ts" },
        interface: { "3.19.0": "BacsInputData", "6.0.0": "BacsElementData" }
    },
    BankTransfer: {
        path: { "3.19.0": "packages/lib/src/components/BankTransfer/types.ts"},
        interface: { "3.19.0": "BankTransferProps", "6.0.0": "BankTransferConfiguration" }
    },





    
    BcmcMobile: {
        path: { "3.10.0": "packages/lib/src/components/BcmcMobile/types.ts" },
        interface: { "3.10.0": "BcmcMobileProps" }
    },


    BillDesk: {
        path: { "5.49.0": "packages/lib/src/components/BillDesk/types.ts" },
        interface: { "5.49.0": "BillDeskProps" }
    },
    Blik: {
        path: { "3.10.0": "packages/lib/src/components/Blik/types.ts" },
        interface: { "3.10.0": "BlikProps" }
    },




    Boleto: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Card: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    CashAppPay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    ClickToPay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Doku: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Donation: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Dotpay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Dragonpay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Dropin: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    DuitNow: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    EPS: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Econtext: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    FacilyPay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Giftcard: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Giropay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    GooglePay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Klarna: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    MBWay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    MealVoucherFR: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    MolPayEBanking: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Multibanco: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    OnlineBankingCZ: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    OnlineBankingFI: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    OnlineBankingIN: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    OnlineBankingPL: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    OnlineBankingSK: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Oxxo: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayByBank: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayByBankPix: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayByBankUS: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayMe: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayNow: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayPal: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayPalFastlane: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayTo: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PayU: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PersonalDetails: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Pix: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PreAuthorizedDebitCanada: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    PromptPay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    RatePay: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Redirect: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Riverty: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Sepa: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Swish: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    ThreeDS2: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Trustly: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Twint: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    UPI: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    Vipps: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    WalletIN: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
    WeChat: {
        path: { "3.10.0": "<FILLER_PATH>", "6.0.0": "<FILLER_PATH>" },
        interface: { "3.10.0": "<FILLER_INTERFACE>", "6.0.0": "<FILLER_INTERFACE>" }
    },
};
