import { Injectable, Logger } from '@nestjs/common';
import { LarkEncryptVerificationRequestDto } from './dto/verification-request.dto';
import { AESCipher } from './lark-event-decryption';
@Injectable()
export class AppService {
  logger = new Logger(AppService.name);
  private readonly LARK_API_URL = 'https://open.larksuite.com';
  private LARK_APP_ID = 'cli_a531f91211f8d010';
  private LARK_ENCRYPT_KEY = '8W2Zgbw3WpCRdJawciwfFcAglvFiK1PU';

  constructor() {}

  async eventWebhook(request: LarkEncryptVerificationRequestDto): Promise<any> {
    try {
      console.log('===========');
      this.logger.log(
        `eventWebhook request = ${JSON.stringify(request?.encrypt)}`,
      );

      const cipher = new AESCipher(this.LARK_ENCRYPT_KEY);
      const challengeDecrypt = cipher.decrypt(request.encrypt);
      //this.logger.log(`eventWebhook challengeDecrypt = ${challengeDecrypt}`);
      const verifyObj = JSON.parse(challengeDecrypt);
      console.log('verifyObj', verifyObj);
      if (
        verifyObj.hasOwnProperty('type') &&
        verifyObj.type === 'url_verification'
      ) {
        return {
          challenge: verifyObj.challenge,
        };
      }
      // const eventId = verifyObj?.uuid;
      // const eventContent = verifyObj?.event;
      // console.log(eventId, eventContent);
    } catch (error) {
      this.logger.error(`eventWebhook get error = ${error.stack}`);
    }
  }
}
