const module = Process.findModuleByName("libg.so");
const base = module.base;
Memory.protect(base, module.size, "rwx");

const decrypt_key_addr = base.add(0x3CE9D8); //update function

let decrypt_key = new NativeFunction(decrypt_key_addr, "uint", ["pointer"]);

function reverse_hex(hex_string) {
    if (hex_string.length % 2 !== 0) {
        hex_string = '0' + hex_string;
    }
    let byte_array = [];
    for (let i = 0; i < hex_string.length; i += 2) {
        byte_array.push(parseInt(hex_string.substr(i, 2), 16));
    }
    
    byte_array.reverse();
    let reversed_hex = byte_array.map(byte => {
        let hex = byte.toString(16).toUpperCase();
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    
    return reversed_hex;
}


let key = "";
for(let i = 0; i < 32; i+=4){
    key += reverse_hex(decrypt_key(ptr(i)).toString(16));
}

console.log("THE KEY: " + key);
