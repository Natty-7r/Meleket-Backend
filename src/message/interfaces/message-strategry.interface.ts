import {
  SendAccountCreationParam,
  SendMessageParam,
  SendOTPParam,
} from '../../common/util/types'
export default interface MessageStrategy {
  sendOTP(params: SendOTPParam): Promise<void>
  SendMessageParam(params: SendMessageParam): Promise<void>
  SendAccountCreationMessage(params: SendAccountCreationParam): Promise<void>
}
