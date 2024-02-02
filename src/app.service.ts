import { Injectable, Logger } from '@nestjs/common';
import { LarkEncryptVerificationRequestDto } from './dto/verification-request.dto';
import { AESCipher } from './lark-event-decryption';
import axios from 'axios';
@Injectable()
export class AppService {
  logger = new Logger(AppService.name);
  private readonly LARK_API_URL = 'https://open.larksuite.com';
  private LARK_APP_ID = 'cli_a531f91211f8d010';
  private LARK_ENCRYPT_KEY = '8W2Zgbw3WpCRdJawciwfFcAglvFiK1PU';
  private nFLOW_URL_UPLOAD =
    'https://banca_predev2.nflow.staging.nuclent.com/v1/f/apiApprovalRequestSystem';
  constructor() {}

  async eventWebhook(request: LarkEncryptVerificationRequestDto): Promise<any> {
    try {
      this.logger.log(`Encrypt Event Request : ${request?.encrypt} ==========`);

      const cipher = new AESCipher(this.LARK_ENCRYPT_KEY);
      const challengeDecrypt = cipher.decrypt(request.encrypt);
      const verifyObj = JSON.parse(challengeDecrypt);
      console.log('Object Decode', verifyObj);
      //Verify hash encrypt for lark
      if (
        verifyObj.hasOwnProperty('type') &&
        verifyObj.type === 'url_verification'
      ) {
        return {
          challenge: verifyObj.challenge,
        };
      }
      const typeEvent = verifyObj?.event?.type;
      if (typeEvent === 'approval_instance') {
        const status = verifyObj?.event?.status;
        const instanceCode = verifyObj?.event?.instance_code;
        await this.uploadStatusRequest(instanceCode, status);
      }
    } catch (error) {
      this.logger.error(`eventWebhook get error = ${error.stack}`);
    }
  }

  async uploadStatusRequest(instanceCode: string, status: string) {
    try {
      const res = await axios.post(this.nFLOW_URL_UPLOAD, {
        instanceCode,
        status,
      });
      if (res.data.statusCode !== 200) {
        this.logger.error('Error Uploading Status: ' + res.data.message);
      } else {
        this.logger.log(
          `Upload Status with instanceCode: ${instanceCode} successfully!`,
        );
      }
    } catch (error: any) {
      this.logger.error('Error Uploading Status: ' + error.message);
    }
  }
}
