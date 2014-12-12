module.exports = {
  valid: {
    destination_address: 'rHXcECnhu9JwNphxqzRDU76iydhGEftWtU',
    source_address: 'rwXNHZD4F6SzyE2yXhjhHZhLzMxtcXLSvt',
    amount: '5.00+USD'
  },
  invalid: {
    amount: {
      destination_address: 'rHXcECnhu9JwNphxqzRDU76iydhGEftWtU',
      source_address: 'rwXNHZD4F6SzyE2yXhjhHZhLzMxtcXLSvt',
      amount: 'USD+5.00' // incorrect order
    },
    destination_address: {
      destination_address: 'r132321',
      source_address: 'rwXNHZD4F6SzyE2yXhjhHZhLzMxtcXLSvt',
      amount: 'USD+5.00'
    },
    source_address: {
      destination_address: 'rHXcECnhu9JwNphxqzRDU76iydhGEftWtU',
      source_address: 'r132321',
      amount: 'USD+5.00'
    }
  }
};