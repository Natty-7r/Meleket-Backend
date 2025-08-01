import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { generateRandomString } from 'src/common/helpers/string.helper'
import api from 'src/common/lib/api'
import {
  ChapaConfig,
  ChapaCustomerInfo,
  Options,
  PaymentInitResponse,
  PaymentSuccessResponse,
} from 'src/common/types/base.type'
import { ChapaInitOptionParams } from 'src/common/types/params.type'
import { ApiResponse } from 'src/common/types/responses.type'

export default class Chapa {
  config: ChapaConfig

  constructor(private readonly configService: ConfigService) {
    this.config = {
      secretKey: this.configService.get<string>('chapa.secretKey'),
      baseUrl: this.configService.get<string>('chapa.baseUrl'),
      initializePath: this.configService.get<string>('chapa.initializePath'),
      verifyPath: this.configService.get<string>('chapa.verifyPath'),
    }
  }

  generateParmentInitOption({
    user,
    amount,
    callbackUrl,
  }: ChapaInitOptionParams): ChapaCustomerInfo {
    return {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      currency: 'ETB',
      amount,
      tx_ref: generateRandomString({}),
      callback_url: callbackUrl,
    }
  }

  private validateCustomerInfo(
    customerInfo: ChapaCustomerInfo,
    options: Options,
  ) {
    const requiredFields: (keyof ChapaCustomerInfo)[] = [
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

  private handleCustomizations(customerInfo: ChapaCustomerInfo) {
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
    initParams: ChapaInitOptionParams,
    options: Options = {},
  ): Promise<ApiResponse<PaymentInitResponse>> {
    try {
      const customerInfo = this.generateParmentInitOption(initParams)
      this.validateCustomerInfo(customerInfo, options)
      this.handleCustomizations(customerInfo)

      const response: ApiResponse = await api({
        url: `${this.config.baseUrl}${this.config.initializePath}`,
        body: { ...customerInfo },
        authToken: this.config.secretKey,
        method: 'POST',
      })
      return {
        status: 'success',
        message: '',
        data: {
          reference: customerInfo.tx_ref,
          ...response.data,
        },
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'fail',
        message: error.message,
        data: null,
      }
    }
  }

  /**
   * Verifies a payment transaction.
   * @param txnRef - The transaction reference to verify. See: https://developer.chapa.co/docs/verify-payments/
   * @returns A Promise that resolves to the API response.
   * @throws Error Throws an error if the verification fails.
   */
  async verify(txnRef: string): Promise<PaymentSuccessResponse> {
    try {
      if (!txnRef || typeof txnRef !== 'string') {
        throw new Error('Transaction reference must be a non-empty string!')
      }
      const response: ApiResponse = await api({
        method: 'GET',
        url: `${this.config.baseUrl}${this.config.verifyPath}${txnRef}`,
        authToken: this.config.secretKey,
      })
      if (response.status !== 'success') throw new Error(response.message)
      const data = response.data
      if (data.status === 'pending')
        throw new BadRequestException('Payment not finished')
      if (data.status === 'fail')
        throw new BadRequestException('Payment failed')
      return {
        amount: data.amount,
        currency: data.currency,
      }
    } catch (error) {
      throw error
    }
  }
}
