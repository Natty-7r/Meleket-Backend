import {
  SendAccountCreationParam,
  SendMessageParam,
  SendOTPParam,
} from '../../common/util/types'

export default interface MessageStrategy {
  sendOTP(params: SendOTPParam): Promise<void>
  sendMessage(params: SendMessageParam): Promise<void>
  sendAccountCreationMessage(params: SendAccountCreationParam): Promise<void>
}
