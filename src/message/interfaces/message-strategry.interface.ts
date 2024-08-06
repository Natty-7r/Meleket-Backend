import { SendMessageParam, SendOTPParam } from '../../common/util/types'
export default interface MessageStrategy {
  sendOTP(params: SendOTPParam): Promise<void>
  SendMessageParam(messageParams: SendMessageParam): Promise<void>
}
