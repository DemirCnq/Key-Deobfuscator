#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>

const std::string server_public_key_str = "47FF1E97C3C79C5B26AACF464EC7034B4CE4FFAD21BA29F25D0C7C65BE244E7E32E0BA1D6C65F0679C9C48E155BA02D577FED286D314E70206770663DE9773ACDCE07397161506779753E7141054D2FE67C002BA40EC489CAF52F06555A7BAE013FD4E240AA67C0CFBAF29BA1DE8FFE4885703C74EB4CFAABA349CC73AFA1EFF";

std::string ByteArrayToHex(const unsigned char* byteArray, size_t length) {
	std::stringstream hexStream;
	hexStream << std::hex << std::setfill('0');

	for (size_t i = 0; i < length; ++i) {
		hexStream << std::setw(2) << static_cast<int>(byteArray[i]);
	}

	return hexStream.str();
}

void StringToHex(const std::string& hexString, unsigned char* outputArray) {
	if (hexString.length() % 2 != 0) {
		throw std::invalid_argument("Hex string must have an even length.");
	}

	size_t length = hexString.length() / 2;
	for (size_t i = 0; i < length; ++i) {
		std::string byteString = hexString.substr(i * 2, 2);
		outputArray[i] = static_cast<unsigned char>(std::stoi(byteString, nullptr, 16));
	}
}

unsigned char* LoadServerPublicKey(unsigned short* server_public_key_obf) {
	unsigned char* server_public_key = (unsigned char*)malloc(32);
	
	if (server_public_key == NULL) return NULL;

	for (int i = 0; i < 16; i++) {
		int v16 = server_public_key_obf[31 - 2 * i + 32];
		int v17 = server_public_key_obf[2 * i + 1] ^ v16 | v16 ^ server_public_key_obf[2 * i];
		*((unsigned short*)&server_public_key[2 * i]) = (unsigned __int16)(((v17 << (11 - (i & 7))) | ((unsigned __int16)v17 >> (((i & 7) - 11) & 0xF))) ^ server_public_key_obf[31 - i + 32]);
	}
	
	return server_public_key;
}
int main() {

	unsigned char server_public_key_obf[128];
	StringToHex(server_public_key_str, server_public_key_obf);
	unsigned __int16* server_public_key_obf2 = (unsigned short*)(&server_public_key_obf[0]);
	unsigned char* server_public_key = LoadServerPublicKey(server_public_key_obf2);
	std::cout << "Result : " << ByteArrayToHex(server_public_key,32) << std::endl;
	return 0;
}
