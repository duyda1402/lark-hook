import { Injectable, Logger } from '@nestjs/common';
import { LarkEncryptVerificationRequestDto } from './dto/verification-request.dto';
import { AESCipher } from './lark-event-decryption';
@Injectable()
export class AppService {
  logger = new Logger(AppService.name);
  private readonly LARK_API_URL = 'https://open.larksuite.com';
  private LARK_APP_ID = 'cli_a531f91211f8d010';
  private LARK_ENCRYPT_KEY = 'kFDK9QJCCIjwvgp0RZsJNvSE2WUwQzui';

  constructor() {}

  async eventWebhook(request: LarkEncryptVerificationRequestDto): Promise<any> {
    try {
      this.logger.log(`eventWebhook request = ${JSON.stringify(request)}`);

      const cipher = new AESCipher(this.LARK_ENCRYPT_KEY);
      const challengeDecrypt = cipher.decrypt(request.encrypt);
      this.logger.log(`eventWebhook challengeDecrypt = ${challengeDecrypt}`);
      const verifyObj = JSON.parse(challengeDecrypt);

      // return challenge to verify webhook url
      if (
        verifyObj.hasOwnProperty('type') &&
        verifyObj.type === 'url_verification'
      ) {
        return {
          challenge: verifyObj.challenge,
        };
      }

      const messageId = verifyObj?.event?.message?.message_id;

      const messageContent = verifyObj?.event?.message?.content || '';
      const messageContentObj = JSON.parse(messageContent);
      console.log(messageId, messageContentObj);
    } catch (error) {
      this.logger.error(`eventWebhook get error = ${error.stack}`);
    }
  }
}
