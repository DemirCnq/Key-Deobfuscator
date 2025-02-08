const server_public_key_str = "47FF1E97C3C79C5B26AACF464EC7034B4CE4FFAD21BA29F25D0C7C65BE244E7E32E0BA1D6C65F0679C9C48E155BA02D577FED286D314E70206770663DE9773ACDCE07397161506779753E7141054D2FE67C002BA40EC489CAF52F06555A7BAE013FD4E240AA67C0CFBAF29BA1DE8FFE4885703C74EB4CFAABA349CC73AFA1EFF";

/**
 * Convert a byte array to a hexadecimal string
 * @param {Uint8Array} byteArray - The byte array to convert
 * @returns {string} Hexadecimal representation of the byte array
 */
function byteArrayToHex(byteArray) {
    return Array.from(byteArray)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Convert a hexadecimal string to a byte array
 * @param {string} hexString - The hexadecimal string to convert
 * @returns {Uint8Array} Byte array representation of the hex string
 */
function stringToHex(hexString) {
    if (hexString.length % 2 !== 0) {
        throw new Error("Hex string must have an even length.");
    }

    const length = hexString.length / 2;
    const byteArray = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        const byteString = hexString.substr(i * 2, 2);
        byteArray[i] = parseInt(byteString, 16);
    }

    return byteArray;
}


function loadServerPublicKey(serverPublicKeyObf) {
    const serverPublicKey = new Uint8Array(32);

    for (let i = 0; i < 16; i++) {
        const v16 = serverPublicKeyObf[31 - 2 * i + 32]; //keyin yarısından itibaren alıp ikiler ikiler atla
        const v17 = serverPublicKeyObf[2 * i + 1] ^ v16 | v16 ^ serverPublicKeyObf[2 * i];
        
        // shift ve xor işlemleri
        const rotatedValue = ((v17 << (11 - (i & 7))) | (v17 >>> (((i & 7) - 11) & 0xF))) 
                             ^ serverPublicKeyObf[31 - i + 32];
        
        const uint16View = new Uint16Array(serverPublicKey.buffer);
        uint16View[i] = rotatedValue & 0xFFFF;
    }

    return serverPublicKey;
}


function main() {
    const serverPublicKeyObf = stringToHex(server_public_key_str);
    const serverPublicKeyObf2 = new Uint16Array(serverPublicKeyObf.buffer);
    const serverPublicKey = loadServerPublicKey(serverPublicKeyObf2);
    
    console.log("Result:", byteArrayToHex(serverPublicKey));
}

main();
