import { v4 as uuidv4 } from 'uuid'
import {
  ChapaConfig,
  CustomerInfo,
  Options,
} from 'src/common/util/types/base.type'
import { ApiResponse } from 'src/common/util/types/responses.type'
import { ConfigService } from '@nestjs/config'
import api from 'src/common/lib/api'

class ChapaStrategy {
  config: ChapaConfig

  constructor(private readonly configService: ConfigService) {
    this.init()
  }

  init() {
    this.config = {
      secretKey: this.configService.get<string>('chapa.secret_key'),
      baseUrl: this.configService.get<string>('chapa.baseUrl'),
      initializePath: this.configService.get<string>('chapa.initializePath'),
      verifyPath: this.configService.get<string>('chapa.verifyPath'),
    }
  }

  private validateCustomerInfo(customerInfo: CustomerInfo, options: Options) {
    const requiredFields: (keyof CustomerInfo)[] = [
      'amount',
      'currency',
      'email',
      'first_name',
      'last_name',
      'callback_url',
    ]

    const fieldTypes: Record<string, string> = {
      amount: 'number',
      currency: 'string',
      email: 'string',
      first_name: 'string',
      last_name: 'string',
      callback_url: 'string',
      customization: 'object',
    }

    const errors: string[] = []

    requiredFields.forEach((field) => {
      if (!(field in customerInfo)) {
        errors.push(`Field '${field}' is required!`)
      } else if (
        fieldTypes[field] &&
        typeof customerInfo[field] !== fieldTypes[field]
      ) {
        errors.push(`Field '${field}' must be of type '${fieldTypes[field]}'.`)
      }
    })

    if (!options.autoRef && !customerInfo.tx_ref) {
      errors.push(
        "Field 'tx_ref' is required! or pass '{autoRef: true}' to the options",
      )
    }

    if (errors.length) {
      throw new Error(errors.join('\n'))
    }
  }

  private handleCustomizations(customerInfo: CustomerInfo) {
    if (
      customerInfo.customization &&
      typeof customerInfo.customization === 'object'
    ) {
      /* eslint-disable */
      Object.assign(customerInfo, customerInfo.customization)
      delete customerInfo.customization
      /* eslint-disable */
    }
  }

  /**
   * Initializes a payment transaction.
   * @param customerInfo - Customer information. See: https://developer.chapa.co/docs/accept-payments/
   * @param options - Additional options.
   * @param options.autoRef - If true, generates a transaction reference automatically if not provided.
   * @returns A Promise that resolves to the API response.
   * @throws Error Throws an error if the initialization fails.
   */
  async initialize(
    customerInfo: CustomerInfo,
    options: Options = {},
  ): Promise<ApiResponse> {
    this.validateCustomerInfo(customerInfo, options)
    this.handleCustomizations(customerInfo)

    const txRef = customerInfo.tx_ref || uuidv4()
    const response: ApiResponse = await api({
      url: `${this.config.baseUrl}${this.config.initializePath}`,
      body: { ...customerInfo, txRef },
      authToken: this.config.secretKey,
      method: 'POST',
    })

    return response.data
  }

  /**
   * Verifies a payment transaction.
   * @param txnRef - The transaction reference to verify. See: https://developer.chapa.co/docs/verify-payments/
   * @returns A Promise that resolves to the API response.
   * @throws Error Throws an error if the verification fails.
   */
  async verify(txnRef: string): Promise<ApiResponse> {
    if (!txnRef || typeof txnRef !== 'string') {
      throw new Error('Transaction reference must be a non-empty string!')
    }
    const response: ApiResponse = await api({
      method: 'GET',
      url: `${this.config.baseUrl}${this.config.verifyPath}${txnRef}`,
      authToken: this.config.secretKey,
    })

    return response.data
  }
}

export default ChapaStrategy
