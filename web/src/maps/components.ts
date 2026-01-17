export interface ComponentName {
  path: Record<string, string>;
  interface: Record<string, string>;
}

/**
 * Component map for Adyen Web SDK
 *
 * Path versions:
 * - Before v3.14.0: src/components/...
 * - v3.14.0+: packages/lib/src/components/...
 *
 * Interface naming:
 * - Before v6.0.0: Various (*Props, *ElementProps, *PaymentsProps)
 * - v6.0.0+: *Configuration
 *
 * Note: Some components don't have types.ts files. For these, the path
 * points to the component file itself (e.g., Component.tsx).
 */
export const components: Record<string, ComponentName> = {
  // ACH Direct Debit
  Ach: {
    path: {
      "3.14.0": "packages/lib/src/components/Ach/components/AchInput/defaultProps.ts",
      "5.24.0": "packages/lib/src/components/Ach/types.ts",
    },
    interface: {
      "3.14.0": "default",
      "5.24.0": "AchElementProps",
      "6.0.0": "AchConfiguration",
    },
  },

  // Affirm (introduced ~v4.0.0)
  Affirm: {
    path: {
      "4.0.0": "packages/lib/src/components/Affirm/Affirm.tsx",
    },
    interface: {
      "4.0.0": "UIElementProps", // Uses parent class props
      "6.0.0": "UIElementProps",
    },
  },

  // AfterPay
  AfterPay: {
    path: {
      "3.10.0": "src/components/AfterPay/AfterPay.tsx",
      "3.14.0": "packages/lib/src/components/AfterPay/AfterPay.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "6.0.0": "UIElementProps",
    },
  },

  // Amazon Pay (introduced v3.20.0)
  AmazonPay: {
    path: {
      "3.20.0": "packages/lib/src/components/AmazonPay/types.ts",
    },
    interface: {
      "3.20.0": "AmazonPayElementProps",
      "6.0.0": "AmazonPayConfiguration",
    },
  },

  // ANCV (introduced ~v5.52.0)
  ANCV: {
    path: {
      "5.52.0": "packages/lib/src/components/ANCV/ANCV.tsx",
      "6.0.0": "packages/lib/src/components/ANCV/types.ts",
    },
    interface: {
      "5.52.0": "ANCVProps",
      "6.0.0": "ANCVConfiguration",
    },
  },

  // Apple Pay
  ApplePay: {
    path: {
      "3.10.0": "src/components/ApplePay/types.ts",
      "3.14.0": "packages/lib/src/components/ApplePay/types.ts",
    },
    interface: {
      "3.10.0": "ApplePayElementProps",
      "6.0.0": "ApplePayConfiguration",
    },
  },

  // Atome (introduced ~v5.30.0)
  Atome: {
    path: {
      "5.30.0": "packages/lib/src/components/Atome/Atome.tsx",
      "6.13.0": "packages/lib/src/components/Atome/types.ts",
    },
    interface: {
      "5.30.0": "UIElementProps",
      "6.13.0": "AtomeConfiguration",
    },
  },

  // Bacs Direct Debit (introduced v3.19.0)
  BacsDD: {
    path: {
      "3.19.0": "packages/lib/src/components/BacsDD/components/types.ts",
      "6.0.0": "packages/lib/src/components/BacsDD/types.ts",
    },
    interface: {
      "3.19.0": "BacsInputData",
      "6.0.0": "BacsElementData",
    },
  },

  // Bank Transfer (introduced v3.19.0)
  BankTransfer: {
    path: {
      "3.19.0": "packages/lib/src/components/BankTransfer/types.ts",
    },
    interface: {
      "3.19.0": "BankTransferProps",
      "6.0.0": "BankTransferConfiguration",
    },
  },

  // BCMC Mobile
  BcmcMobile: {
    path: {
      "3.10.0": "src/components/BcmcMobile/types.ts",
      "3.14.0": "packages/lib/src/components/BcmcMobile/types.ts",
    },
    interface: {
      "3.10.0": "BcmcMobileProps",
    },
  },

  // BillDesk
  BillDesk: {
    path: {
      "5.49.0": "packages/lib/src/components/BillDesk/types.ts",
    },
    interface: {
      "5.49.0": "BillDeskProps",
    },
  },

  // BLIK
  Blik: {
    path: {
      "3.10.0": "src/components/Blik/types.ts",
      "3.14.0": "packages/lib/src/components/Blik/types.ts",
      "6.0.0": "packages/lib/src/components/Blik/Blik.tsx", // No types.ts in v6
    },
    interface: {
      "3.10.0": "BlikProps",
      "6.0.0": "AwaitConfiguration", // Uses AwaitConfiguration
    },
  },

  // Boleto
  Boleto: {
    path: {
      "3.10.0": "src/components/Boleto/Boleto.tsx",
      "3.14.0": "packages/lib/src/components/Boleto/types.ts",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "3.14.0": "BoletoElementProps",
      "6.0.0": "BoletoElementProps", // Still uses ElementProps in v6
    },
  },

  // Card
  Card: {
    path: {
      "3.10.0": "src/components/Card/Card.tsx", // No types.ts in v3.10.0
      "3.14.0": "packages/lib/src/components/Card/types.ts",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "3.14.0": "CardElementProps",
      "6.0.0": "CardConfiguration",
    },
  },

  // Cash App Pay (introduced ~v5.45.0)
  CashAppPay: {
    path: {
      "5.45.0": "packages/lib/src/components/CashAppPay/types.ts",
    },
    interface: {
      "5.45.0": "CashAppPayElementProps",
      "6.0.0": "CashAppPayConfiguration",
    },
  },

  // Click to Pay (introduced ~v5.45.0)
  ClickToPay: {
    path: {
      "5.45.0": "packages/lib/src/components/ClickToPay/types.ts",
    },
    interface: {
      "5.45.0": "ClickToPayProps",
      "6.0.0": "ClickToPayConfiguration",
    },
  },

  // Custom Card
  CustomCard: {
    path: {
      "6.0.0": "packages/lib/src/components/CustomCard/types.ts",
    },
    interface: {
      "6.0.0": "CustomCardConfiguration",
    },
  },

  // Doku
  Doku: {
    path: {
      "3.10.0": "src/components/Doku/Doku.tsx",
      "3.14.0": "packages/lib/src/components/Doku/Doku.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // Donation
  Donation: {
    path: {
      "3.10.0": "src/components/Donation/types.ts",
      "3.14.0": "packages/lib/src/components/Donation/types.ts",
    },
    interface: {
      "3.10.0": "DonationProps",
      "6.0.0": "DonationConfiguration",
    },
  },

  // Dotpay
  Dotpay: {
    path: {
      "3.10.0": "src/components/Dotpay/Dotpay.tsx",
      "3.14.0": "packages/lib/src/components/Dotpay/Dotpay.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // Dragonpay
  Dragonpay: {
    path: {
      "3.10.0": "src/components/Dragonpay/Dragonpay.tsx",
      "3.14.0": "packages/lib/src/components/Dragonpay/Dragonpay.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // Drop-in
  Dropin: {
    path: {
      "3.10.0": "src/components/Dropin/types.ts",
      "3.14.0": "packages/lib/src/components/Dropin/types.ts",
    },
    interface: {
      "3.10.0": "DropinElementProps",
      "6.0.0": "DropinConfiguration",
    },
  },

  // DuitNow (introduced ~v5.35.0)
  DuitNow: {
    path: {
      "5.35.0": "packages/lib/src/components/DuitNow/DuitNow.tsx",
    },
    interface: {
      "5.35.0": "QRLoaderConfiguration",
      "6.0.0": "QRLoaderConfiguration",
    },
  },

  // EPS
  EPS: {
    path: {
      "3.10.0": "src/components/EPS/EPS.tsx",
      "3.14.0": "packages/lib/src/components/EPS/EPS.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "6.0.0": "IssuerListConfiguration",
    },
  },

  // Econtext
  Econtext: {
    path: {
      "3.10.0": "src/components/Econtext/Econtext.tsx",
      "3.14.0": "packages/lib/src/components/Econtext/Econtext.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // FacilyPay
  FacilyPay: {
    path: {
      "3.10.0": "src/components/FacilyPay/FacilyPay.tsx",
      "3.14.0": "packages/lib/src/components/FacilyPay/FacilyPay.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // Gift Card
  Giftcard: {
    path: {
      "3.10.0": "src/components/Giftcard/Giftcard.tsx",
      "3.14.0": "packages/lib/src/components/Giftcard/Giftcard.tsx",
      "6.0.0": "packages/lib/src/components/Giftcard/types.ts",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "6.0.0": "GiftCardConfiguration",
    },
  },

  // Giropay
  Giropay: {
    path: {
      "3.10.0": "src/components/Giropay/Giropay.tsx",
      "3.14.0": "packages/lib/src/components/Giropay/Giropay.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // Google Pay
  GooglePay: {
    path: {
      "3.10.0": "src/components/GooglePay/types.ts",
      "3.14.0": "packages/lib/src/components/GooglePay/types.ts",
    },
    interface: {
      "3.10.0": "GooglePayProps",
      "6.0.0": "GooglePayConfiguration",
    },
  },

  // Klarna (introduced v5.0.0)
  Klarna: {
    path: {
      "5.0.0": "packages/lib/src/components/Klarna/types.ts",
    },
    interface: {
      "5.0.0": "KlarnaPaymentsProps",
      "6.0.0": "KlarnaConfiguration",
    },
  },

  // MB Way
  MBWay: {
    path: {
      "3.10.0": "src/components/MBWay/MBWay.tsx",
      "3.14.0": "packages/lib/src/components/MBWay/MBWay.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "6.0.0": "UIElementProps",
    },
  },

  // Meal Voucher FR (introduced ~v5.35.0)
  MealVoucherFR: {
    path: {
      "5.35.0": "packages/lib/src/components/MealVoucherFR/types.ts",
    },
    interface: {
      "5.35.0": "MealVoucherFRElementProps",
      "6.0.0": "MealVoucherFRConfiguration",
    },
  },

  // MolPay eBanking
  MolPayEBanking: {
    path: {
      "3.10.0": "src/components/MolPayEBanking/MolPayEBanking.tsx",
      "3.14.0": "packages/lib/src/components/MolPayEBanking/MolPayEBanking.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // Multibanco
  Multibanco: {
    path: {
      "3.10.0": "src/components/Multibanco/Multibanco.tsx",
      "3.14.0": "packages/lib/src/components/Multibanco/Multibanco.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "6.0.0": "QRLoaderConfiguration",
    },
  },

  // Online Banking CZ (introduced ~v5.35.0)
  OnlineBankingCZ: {
    path: {
      "5.35.0": "packages/lib/src/components/OnlineBankingCZ/OnlineBankingCZ.tsx",
    },
    interface: {
      "5.35.0": "IssuerListConfiguration",
      "6.0.0": "IssuerListConfiguration",
    },
  },

  // Online Banking FI (introduced v6.0.0)
  OnlineBankingFI: {
    path: {
      "6.0.0": "packages/lib/src/components/OnlineBankingFI/OnlineBankingFI.tsx",
    },
    interface: {
      "6.0.0": "IssuerListConfiguration",
    },
  },

  // Online Banking IN (introduced ~v5.35.0)
  OnlineBankingIN: {
    path: {
      "5.35.0": "packages/lib/src/components/OnlineBankingIN/OnlineBankingIN.tsx",
    },
    interface: {
      "5.35.0": "IssuerListConfiguration",
      "6.0.0": "IssuerListConfiguration",
    },
  },

  // Online Banking PL (introduced ~v5.35.0)
  OnlineBankingPL: {
    path: {
      "5.35.0": "packages/lib/src/components/OnlineBankingPL/OnlineBankingPL.tsx",
    },
    interface: {
      "5.35.0": "IssuerListConfiguration",
      "6.0.0": "IssuerListConfiguration",
    },
  },

  // Online Banking SK (introduced ~v5.35.0)
  OnlineBankingSK: {
    path: {
      "5.35.0": "packages/lib/src/components/OnlineBankingSK/OnlineBankingSK.tsx",
    },
    interface: {
      "5.35.0": "IssuerListConfiguration",
      "6.0.0": "IssuerListConfiguration",
    },
  },

  // Oxxo
  Oxxo: {
    path: {
      "3.10.0": "src/components/Oxxo/Oxxo.tsx",
      "3.14.0": "packages/lib/src/components/Oxxo/Oxxo.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // Pay By Bank (introduced ~v5.35.0)
  PayByBank: {
    path: {
      "5.35.0": "packages/lib/src/components/PayByBank/types.ts",
    },
    interface: {
      "5.35.0": "PayByBankProps",
      "6.0.0": "PayByBankConfiguration",
    },
  },

  // Pay By Bank Pix (introduced ~v6.15.0)
  PayByBankPix: {
    path: {
      "6.15.0": "packages/lib/src/components/PayByBankPix/types.ts",
    },
    interface: {
      "6.15.0": "PayByBankPixConfiguration",
    },
  },

  // Pay By Bank US (introduced ~v6.20.0)
  PayByBankUS: {
    path: {
      "6.20.0": "packages/lib/src/components/PayByBankUS/types.ts",
    },
    interface: {
      "6.20.0": "PayByBankUSConfiguration",
    },
  },

  // PayMe (introduced ~v5.60.0)
  PayMe: {
    path: {
      "5.60.0": "packages/lib/src/components/PayMe/PayMe.tsx",
    },
    interface: {
      "5.60.0": "QRLoaderConfiguration",
      "6.0.0": "QRLoaderConfiguration",
    },
  },

  // PayNow (introduced ~v5.35.0)
  PayNow: {
    path: {
      "5.35.0": "packages/lib/src/components/PayNow/PayNow.tsx",
    },
    interface: {
      "5.35.0": "QRLoaderConfiguration",
      "6.0.0": "QRLoaderConfiguration",
    },
  },

  // PayPal
  PayPal: {
    path: {
      "3.10.0": "src/components/PayPal/types.ts",
      "3.14.0": "packages/lib/src/components/PayPal/types.ts",
    },
    interface: {
      "3.10.0": "PayPalCommonProps",
      "5.0.0": "PayPalElementProps",
      "6.0.0": "PayPalConfiguration",
    },
  },

  // PayPal Fastlane (introduced ~v6.10.0)
  PayPalFastlane: {
    path: {
      "6.10.0": "packages/lib/src/components/PayPalFastlane/types.ts",
    },
    interface: {
      "6.10.0": "PayPalFastlaneConfiguration",
    },
  },

  // PayTo (introduced ~v6.5.0)
  PayTo: {
    path: {
      "6.5.0": "packages/lib/src/components/PayTo/types.ts",
    },
    interface: {
      "6.5.0": "PayToConfiguration",
    },
  },

  // PayU
  PayU: {
    path: {
      "3.10.0": "src/components/PayU/PayU.tsx",
      "3.14.0": "packages/lib/src/components/PayU/PayU.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
    },
  },

  // Personal Details (introduced v5.0.0)
  PersonalDetails: {
    path: {
      "5.0.0": "packages/lib/src/components/PersonalDetails/types.ts",
    },
    interface: {
      "5.0.0": "PersonalDetailsProps",
      "6.0.0": "PersonalDetailsConfiguration",
    },
  },

  // Pix (introduced v4.0.0)
  Pix: {
    path: {
      "4.0.0": "packages/lib/src/components/Pix/types.ts",
    },
    interface: {
      "4.0.0": "PixElementData",
      "6.0.0": "PixConfiguration",
    },
  },

  // Pre-Authorized Debit Canada (introduced ~v6.0.0)
  PreAuthorizedDebitCanada: {
    path: {
      "6.0.0": "packages/lib/src/components/PreAuthorizedDebitCanada/types.ts",
    },
    interface: {
      "6.0.0": "PreAuthorizedDebitCanadaConfiguration",
    },
  },

  // PromptPay (introduced ~v5.35.0)
  PromptPay: {
    path: {
      "5.35.0": "packages/lib/src/components/PromptPay/PromptPay.tsx",
    },
    interface: {
      "5.35.0": "QRLoaderConfiguration",
      "6.0.0": "QRLoaderConfiguration",
    },
  },

  // RatePay
  RatePay: {
    path: {
      "3.10.0": "src/components/RatePay/RatePay.tsx",
      "3.14.0": "packages/lib/src/components/RatePay/types.ts",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "3.14.0": "RatePayProps",
      "6.0.0": "RatePayConfiguration",
    },
  },

  // Redirect
  Redirect: {
    path: {
      "3.10.0": "src/components/Redirect/Redirect.tsx",
      "3.14.0": "packages/lib/src/components/Redirect/Redirect.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "6.0.0": "RedirectConfiguration",
    },
  },

  // Riverty (introduced ~v5.60.0)
  Riverty: {
    path: {
      "5.60.0": "packages/lib/src/components/Riverty/types.ts",
    },
    interface: {
      "5.60.0": "RivertyProps",
      "6.0.0": "RivertyConfiguration",
    },
  },

  // SEPA Direct Debit
  Sepa: {
    path: {
      "3.10.0": "src/components/Sepa/Sepa.tsx",
      "3.14.0": "packages/lib/src/components/Sepa/types.ts",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "3.14.0": "SepaElementProps",
      "6.0.0": "SepaConfiguration",
    },
  },

  // Swish
  Swish: {
    path: {
      "3.10.0": "src/components/Swish/Swish.tsx",
      "3.14.0": "packages/lib/src/components/Swish/Swish.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "6.0.0": "QRLoaderConfiguration",
    },
  },

  // 3D Secure 2
  ThreeDS2: {
    path: {
      "3.10.0": "src/components/ThreeDS2/types.ts",
      "3.14.0": "packages/lib/src/components/ThreeDS2/types.ts",
    },
    interface: {
      "3.10.0": "ThreeDS2DeviceFingerprintProps",
      "6.0.0": "ThreeDS2Configuration",
    },
  },

  // Trustly (introduced ~v5.55.0)
  Trustly: {
    path: {
      "5.55.0": "packages/lib/src/components/Trustly/Trustly.tsx",
    },
    interface: {
      "5.55.0": "UIElementProps",
      "6.0.0": "TrustlyConfiguration",
    },
  },

  // Twint (introduced v5.0.0)
  Twint: {
    path: {
      "5.0.0": "packages/lib/src/components/Twint/Twint.tsx",
    },
    interface: {
      "5.0.0": "QRLoaderConfiguration",
      "6.0.0": "QRLoaderConfiguration",
    },
  },

  // UPI (introduced ~v5.35.0)
  UPI: {
    path: {
      "5.35.0": "packages/lib/src/components/UPI/types.ts",
    },
    interface: {
      "5.35.0": "UPIProps",
      "6.0.0": "UPIConfiguration",
    },
  },

  // Vipps
  Vipps: {
    path: {
      "3.10.0": "src/components/Vipps/Vipps.tsx",
      "3.14.0": "packages/lib/src/components/Vipps/Vipps.tsx",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "6.0.0": "UIElementProps",
    },
  },

  // Wallet IN (introduced ~v5.35.0)
  WalletIN: {
    path: {
      "5.35.0": "packages/lib/src/components/WalletIN/WalletIN.tsx",
    },
    interface: {
      "5.35.0": "IssuerListConfiguration",
      "6.0.0": "IssuerListConfiguration",
    },
  },

  // WeChat Pay
  WeChat: {
    path: {
      "3.10.0": "src/components/WeChat/WeChat.tsx",
      "3.14.0": "packages/lib/src/components/WeChat/types.ts",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "3.14.0": "WeChatPayElementProps",
      "6.0.0": "WeChatPayConfiguration",
    },
  },

  // Bancontact (Card variant)
  Bancontact: {
    path: {
      "3.10.0": "src/components/Card/Bancontact.ts",
      "3.14.0": "packages/lib/src/components/Bancontact/types.ts",
    },
    interface: {
      "3.10.0": "UIElementProps",
      "3.14.0": "BancontactElementProps",
      "6.0.0": "BancontactConfiguration",
    },
  },
};

/**
 * Helper function to get the appropriate path for a given version
 */
export function getComponentPath(
  componentName: string,
  version: string
): string | null {
  const component = components[componentName];
  if (!component) return null;

  const versions = Object.keys(component.path).sort(compareVersions);
  let selectedPath: string | null = null;

  for (const v of versions) {
    if (compareVersions(version, v) >= 0) {
      selectedPath = component.path[v];
    }
  }

  return selectedPath;
}

/**
 * Helper function to get the appropriate interface name for a given version
 */
export function getComponentInterface(
  componentName: string,
  version: string
): string | null {
  const component = components[componentName];
  if (!component) return null;

  const versions = Object.keys(component.interface).sort(compareVersions);
  let selectedInterface: string | null = null;

  for (const v of versions) {
    if (compareVersions(version, v) >= 0) {
      selectedInterface = component.interface[v];
    }
  }

  return selectedInterface;
}

/**
 * Compare two semantic versions
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareVersions(a: string, b: string): number {
  const parseVersion = (v: string) =>
    v
      .replace(/^v/, "")
      .split(".")
      .map((n) => parseInt(n, 10) || 0);

  const aParts = parseVersion(a);
  const bParts = parseVersion(b);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aNum = aParts[i] || 0;
    const bNum = bParts[i] || 0;

    if (aNum < bNum) return -1;
    if (aNum > bNum) return 1;
  }

  return 0;
}

/**
 * Get all available component names
 */
export function getComponentNames(): string[] {
  return Object.keys(components);
}
