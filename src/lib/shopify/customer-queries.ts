export const CUSTOMER_QUERY = `
  query Customer {
    customer {
      id
      firstName
      lastName
      email
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        zip
        country
        phone
      }
    }
  }
`;

export const ORDERS_QUERY = `
  query Orders($first: Int!, $after: String) {
    customer {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            nodes {
              title
              quantity
              variant {
                title
                image {
                  url
                  altText
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          shippingAddress {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            country
            phone
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const ORDER_BY_ID_QUERY = `
  query OrderById($orderId: ID!) {
    customer {
      orders(first: 1, query: $orderId) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            nodes {
              title
              quantity
              variant {
                title
                image {
                  url
                  altText
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          shippingAddress {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            country
            phone
          }
        }
      }
    }
  }
`;

export const ADDRESSES_QUERY = `
  query Addresses {
    customer {
      addresses(first: 20) {
        nodes {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phone
        }
      }
      defaultAddress {
        id
      }
    }
  }
`;

export const ADDRESS_CREATE_MUTATION = `
  mutation AddressCreate($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADDRESS_UPDATE_MUTATION = `
  mutation AddressUpdate($addressId: ID!, $address: CustomerAddressInput!) {
    customerAddressUpdate(addressId: $addressId, address: $address) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADDRESS_DELETE_MUTATION = `
  mutation AddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
      }
    }
  }
`;
