export interface VariantToInterfaceName {
    interfaceName: string;
    variant: string;
    path: string;
  }
  
  export const variantToInterfaceName: Record<
    string,
    Record<string, VariantToInterfaceName>
  > = {
    dropin: {
      v3: {
        interfaceName: "DropinElementProps",
        variant: "dropin",
        path: "packages/lib/src/components/Dropin/types.ts",
      },
      v4: {
        interfaceName: "DropinElementProps",
        variant: "dropin",
        path: "packages/lib/src/components/Dropin/types.ts",
      },
      v5: {
        interfaceName: "DropinElementProps",
        variant: "dropin",
        path: "packages/lib/src/components/Dropin/types.ts",
      },
      v6: {
        interfaceName: "DropinConfiguration",
        variant: "dropin",
        path: "packages/lib/src/components/Dropin/types.ts",
      },
    },
    card: {
      v3: {
        interfaceName: "CardElementProps",
        variant: "card",
        path: "packages/lib/src/components/Card/types.ts",
      },
      v4: {
        interfaceName: "CardElementProps",
        variant: "card",
        path: "packages/lib/src/components/Card/types.ts",
      },
      v5: {
        interfaceName: "CardElementProps",
        variant: "card",
        path: "packages/lib/src/components/Card/types.ts",
      },
      v6: {
        interfaceName: "CardConfiguration",
        variant: "card",
        path: "packages/lib/src/components/Card/types.ts",
      },
    },
    scheme: {
      v3: {
        interfaceName: "CardElementProps",
        variant: "scheme",
        path: "packages/lib/src/components/Card/types.ts",
      },
      v4: {
        interfaceName: "CardElementProps",
        variant: "scheme",
        path: "packages/lib/src/components/Card/types.ts",
      },
      v5: {
        interfaceName: "CardElementProps",
        variant: "scheme",
        path: "packages/lib/src/components/Card/types.ts",
      },
      v6: {
        interfaceName: "CardConfiguration",
        variant: "scheme",
        path: "packages/lib/src/components/Card/types.ts",
      },
    },
    ancv: {
      v5: {
        interfaceName: "ANCVProps",
        variant: "ancv",
        path: "packages/lib/src/components/ANCV/ANCV.tsx",
      },
      v6: {
        interfaceName: "ANCVConfiguration",
        variant: "ancv",
        path: "packages/lib/src/components/ANCV/types.ts",
      },
    },
    paypal: {
      v3: {
        interfaceName: "PayPalCommonProps",
        variant: "paypal",
        path: "packages/lib/src/components/PayPal/types.ts",
      },
      v4: {
        interfaceName: "PayPalCommonProps",
        variant: "paypal",
        path: "packages/lib/src/components/PayPal/types.ts",
      },
      v5: {
        interfaceName: "PayPalCommonProps",
        variant: "paypal",
        path: "packages/lib/src/components/PayPal/types.ts",
      },
      v6: {
        interfaceName: "PayPalConfiguration",
        variant: "paypal",
        path: "packages/lib/src/components/PayPal/types.ts",
      },
    },
    klarna: {
      v5: {
        interfaceName: "KlarnaPaymentsProps",
        variant: "klarna",
        path: "packages/lib/src/components/Klarna/types.ts",
      },
      v6: {
        interfaceName: "KlarnaConfiguration",
        variant: "klarna",
        path: "packages/lib/src/components/Klarna/types.ts",
      },
    },
    klarna_account: {
      v5: {
        interfaceName: "KlarnaPaymentsProps",
        variant: "klarna_account",
        path: "packages/lib/src/components/Klarna/types.ts",
      },
      v6: {
        interfaceName: "KlarnaConfiguration",
        variant: "klarna_account",
        path: "packages/lib/src/components/Klarna/types.ts",
      },
    },
    klarna_paynow: {
      v5: {
        interfaceName: "KlarnaPaymentsProps",
        variant: "klarna_paynow",
        path: "packages/lib/src/components/Klarna/types.ts",
      },
      v6: {
        interfaceName: "KlarnaConfiguration",
        variant: "klarna_paynow",
        path: "packages/lib/src/components/Klarna/types.ts",
      },
    },
    affirm: {
      v5: {
        interfaceName: "AffirmElementProps",
        variant: "affirm",
        path: "packages/lib/src/components/Affirm/types.ts",
      },
      v6: {
        interfaceName: "AffirmConfiguration",
        variant: "affirm",
        path: "packages/lib/src/components/Affirm/types.ts",
      },
    },
    afterpay: {
      v5: {
        interfaceName: "AfterPayElementProps",
        variant: "afterpay",
        path: "packages/lib/src/components/AfterPay/types.ts",
      },
      v6: {
        interfaceName: "AfterPayConfiguration",
        variant: "afterpay",
        path: "packages/lib/src/components/AfterPay/types.ts",
      },
    },
    alipay: {
      v5: {
        interfaceName: "AlipayElementProps",
        variant: "alipay",
        path: "packages/lib/src/components/Alipay/types.ts",
      },
      v6: {
        interfaceName: "AlipayConfiguration",
        variant: "alipay",
        path: "packages/lib/src/components/Alipay/types.ts",
      },
    },
    amazonpay: {
      v5: {
        interfaceName: "AmazonPayElementProps",
        variant: "amazonpay",
        path: "packages/lib/src/components/AmazonPay/types.ts",
      },
      v6: {
        interfaceName: "AmazonPayConfiguration",
        variant: "amazonpay",
        path: "packages/lib/src/components/AmazonPay/types.ts",
      },
    },
    applepay: {
      v5: {
        interfaceName: "ApplePayElementProps",
        variant: "applepay",
        path: "packages/lib/src/components/ApplePay/types.ts",
      },
      v6: {
        interfaceName: "ApplePayConfiguration",
        variant: "applepay",
        path: "packages/lib/src/components/ApplePay/types.ts",
      },
    },
    atome: {
      v5: {
        interfaceName: "AtomeElementProps",
        variant: "atome",
        path: "packages/lib/src/components/Atome/types.ts",
      },
      v6: {
        interfaceName: "AtomeConfiguration",
        variant: "atome",
        path: "packages/lib/src/components/Atome/types.ts",
      },
    },
    bacs: {
      v5: {
        interfaceName: "BacsElementProps",
        variant: "bacs",
        path: "packages/lib/src/components/Bacs/types.ts",
      },
      v6: {
        interfaceName: "BacsConfiguration",
        variant: "bacs",
        path: "packages/lib/src/components/Bacs/types.ts",
      },
    },
    bancontact: {
      v5: {
        interfaceName: "BancontactElementProps",
        variant: "bcmc",
        path: "packages/lib/src/components/Bancontact/types.ts",
      },
      v6: {
        interfaceName: "BancontactConfiguration",
        variant: "bancontact",
        path: "packages/lib/src/components/Bancontact/types.ts",
      },
    },
    blik: {
      v5: {
        interfaceName: "BLIKElementProps",
        variant: "blik",
        path: "packages/lib/src/components/BLIK/types.ts",
      },
      v6: {
        interfaceName: "BLIKConfiguration",
        variant: "blik",
        path: "packages/lib/src/components/BLIK/types.ts",
      },
    },
    boleto: {
      v5: {
        interfaceName: "BoletoElementProps",
        variant: "boleto",
        path: "packages/lib/src/components/Boleto/types.ts",
      },
      v6: {
        interfaceName: "BoletoConfiguration",
        variant: "boleto",
        path: "packages/lib/src/components/Boleto/types.ts",
      },
    },
    cashapp: {
      v5: {
        interfaceName: "CashAppElementProps",
        variant: "cashapp",
        path: "packages/lib/src/components/CashApp/types.ts",
      },
      v6: {
        interfaceName: "CashAppConfiguration",
        variant: "cashapp",
        path: "packages/lib/src/components/CashApp/types.ts",
      },
    },
    clearpay: {
      v5: {
        interfaceName: "ClearpayElementProps",
        variant: "clearpay",
        path: "packages/lib/src/components/Clearpay/types.ts",
      },
      v6: {
        interfaceName: "ClearpayConfiguration",
        variant: "clearpay",
        path: "packages/lib/src/components/Clearpay/types.ts",
      },
    },
    eps: {
      v5: {
        interfaceName: "EPSElementProps",
        variant: "eps",
        path: "packages/lib/src/components/EPS/types.ts",
      },
      v6: {
        interfaceName: "EPSConfiguration",
        variant: "eps",
        path: "packages/lib/src/components/EPS/types.ts",
      },
    },
    gcash: {
      v5: {
        interfaceName: "GCashElementProps",
        variant: "gcash",
        path: "packages/lib/src/components/GCash/types.ts",
      },
      v6: {
        interfaceName: "GCashConfiguration",
        variant: "gcash",
        path: "packages/lib/src/components/GCash/types.ts",
      },
    },
    giftcard: {
      v5: {
        interfaceName: "GiftCardElementProps",
        variant: "giftcard",
        path: "packages/lib/src/components/GiftCard/types.ts",
      },
      v6: {
        interfaceName: "GiftCardConfiguration",
        variant: "giftcard",
        path: "packages/lib/src/components/GiftCard/types.ts",
      },
    },
    googlepay: {
      v5: {
        interfaceName: "GooglePayElementProps",
        variant: "googlepay",
        path: "packages/lib/src/components/GooglePay/types.ts",
      },
      v6: {
        interfaceName: "GooglePayConfiguration",
        variant: "googlepay",
        path: "packages/lib/src/components/GooglePay/types.ts",
      },
    },
    mbway: {
      v5: {
        interfaceName: "MBWayElementProps",
        variant: "mbway",
        path: "packages/lib/src/components/MBWay/types.ts",
      },
      v6: {
        interfaceName: "MBWayConfiguration",
        variant: "mbway",
        path: "packages/lib/src/components/MBWay/types.ts",
      },
    },
    mobilepay: {
      v5: {
        interfaceName: "MobilePayElementProps",
        variant: "mobilepay",
        path: "packages/lib/src/components/MobilePay/types.ts",
      },
      v6: {
        interfaceName: "MobilePayConfiguration",
        variant: "mobilepay",
        path: "packages/lib/src/components/MobilePay/types.ts",
      },
    },
    momo: {
      v5: {
        interfaceName: "MomoElementProps",
        variant: "momo",
        path: "packages/lib/src/components/Momo/types.ts",
      },
      v6: {
        interfaceName: "MomoConfiguration",
        variant: "momo",
        path: "packages/lib/src/components/Momo/types.ts",
      },
    },
    multibanco: {
      v5: {
        interfaceName: "MultibancoElementProps",
        variant: "multibanco",
        path: "packages/lib/src/components/Multibanco/types.ts",
      },
      v6: {
        interfaceName: "MultibancoConfiguration",
        variant: "multibanco",
        path: "packages/lib/src/components/Multibanco/types.ts",
      },
    },
    twint: {
      v5: {
        interfaceName: "TwintElementProps",
        variant: "twint",
        path: "packages/lib/src/components/Twint/types.ts",
      },
      v6: {
        interfaceName: "TwintConfiguration",
        variant: "twint",
        path: "packages/lib/src/components/Twint/types.ts",
      },
    },
    wechatpay: {
      v5: {
        interfaceName: "WeChatPayElementProps",
        variant: "wechatpayWeb",
        path: "packages/lib/src/components/WeChatPay/types.ts",
      },
      v6: {
        interfaceName: "WeChatPayConfiguration",
        variant: "wechatpay",
        path: "packages/lib/src/components/WeChatPay/types.ts",
      },
    },
    pix: {
      v5: {
        interfaceName: "PixElementData",
        variant: "pix",
        path: "packages/lib/src/components/Pix/types.ts"
      },
      v6: {
        interfaceName: "PixElementData", 
        variant: "pix",
        path: "packages/lib/src/components/Pix/types.ts"
      }
    },
  };
  