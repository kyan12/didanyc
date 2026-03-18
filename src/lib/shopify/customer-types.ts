export interface CustomerOrder {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    nodes: CustomerLineItem[];
  };
  shippingAddress: CustomerAddress | null;
}

export interface CustomerLineItem {
  title: string;
  quantity: number;
  variant: {
    title: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    price: {
      amount: string;
      currencyCode: string;
    };
  } | null;
}

export interface CustomerAddress {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string | null;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  defaultAddress: CustomerAddress | null;
}

export interface OrdersResponse {
  customer: {
    orders: {
      nodes: CustomerOrder[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

export interface OrderResponse {
  customer: {
    orders: {
      nodes: CustomerOrder[];
    };
  };
}

export interface AddressesResponse {
  customer: {
    addresses: {
      nodes: CustomerAddress[];
    };
    defaultAddress: CustomerAddress | null;
  };
}

export interface CustomerResponse {
  customer: Customer;
}
