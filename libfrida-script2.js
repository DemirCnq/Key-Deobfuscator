function reverse(value) { //Little Endian to Big Endian Function
    let reversed = 0n;
    const bytelen = Math.ceil(value.toString(16).length / 2);
    for (let i = 0; i < bytelen; i++) {
        reversed = (reversed << 8n) | (value & 0xFFn);
        value >>= 8n;
    }

    return reversed;
}

const base = Module.getBaseAddress('libg.so');
const offset = 0x3CE9D8; //dehasher
const address = base.add(offset);

var isFilter = true
var count = 0


Interceptor.attach(address, {
    onEnter(args) {},
    onLeave(retval) {
        toast("leaved")
        count++;
        if (isFilter || [13, 14, 15, 16].includes(count)) {
            const reversed = reverse(BigInt(retval));
            let buffer = '';
            buffer += reversed.toString(16);
            if (count === 16) console.log(buffer);
        } else {
            const reversed = reverse(BigInt(retval));
            const buffer = reversed.toString(16) + '\n';
            console.log(buffer)
        }
    }
});
