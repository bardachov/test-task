import crypto from 'crypto';
export default async function cryptoString(len: number): Promise<string>{
    return new Promise(resolve => {
        crypto.randomBytes(48, (err, buffer) => resolve(buffer.toString('hex').slice(0, len)))
    })
}