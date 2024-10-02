import {
  SendAccountCreationParams,
  SendMessageParams,
  SendOTPParams,
} from '../../common/types/params.type'

export default interface MessageStrategy {
  sendOTP(params: SendOTPParams): Promise<void>
  sendMessage(params: SendMessageParams): Promise<void>
  sendAccountCreationMessage(params: SendAccountCreationParams): Promise<void>
}
