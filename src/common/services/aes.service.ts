import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AesService {
    private key: Buffer;
    private iv: Buffer;

    constructor() {
        const iv: number[] = [0x00, 0x01, 0x02, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x03, 0x04, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];
        const key: number[] = [0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71,
            0xbe, 0x2b, 0x85, 0x7d, 0x77, 0x73, 0xae, 0xf0, 0x81, 0x1f, 0x35, 0x2c,
            0x07, 0x98, 0x10, 0xa3, 0x09, 0x14, 0x3b, 0x61, 0x08, 0xd7, 0x2d, 0xdf,
            0xf4];
        // You should set the key and iv values accordingly
        this.key = Buffer.from(key);
        this.iv = Buffer.from(iv);
    }

    // Helper function to convert hex string to Buffer
    hexToBuffer(hex: string): Buffer {
        return Buffer.from(hex, 'hex');
    }

    decryptText(encryptedData: ArrayBuffer): Buffer {
        try {
            const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
            const buffer = new Uint8Array(encryptedData);
            let decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
            return decrypted;
        } catch (err) {
            console.log("decrypt error", err);
            return null;
        }

    }

    encryptText(plaintext: string): string {
        try {
            const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
            let encrypted = cipher.update(plaintext, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        } catch (err) {
            console.log("decrypt error", err);
            return null;
        }
    }

    byteToHex(byteArray: number[]): string {
        return byteArray.map(byte => {
            return ('0' + byte.toString(16)).slice(-2);
        }).join('');
    }

    addPadding(text, blockLength) {
        const paddingLength = blockLength - (text.length % blockLength);
        const paddingChar = String.fromCharCode(12); // ASCII code for '\f'
        return text + paddingChar.repeat(paddingLength);
    }
}