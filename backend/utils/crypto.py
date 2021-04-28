import hashlib
import os
import binascii

def hash_password(psd):
    salt = hashlib.sha256(os.urandom(48)).hexdigest().encode('ascii')
    key = hashlib.pbkdf2_hmac(
                'sha256',
                psd.encode('utf-8'),
                salt,
                100000
            )
    key = binascii.hexlify(key)
    return (salt + key).decode('ascii')


def check_password(psd, psd_hash):
    salt = psd_hash[:64]
    stored_hash = psd_hash[64:]

    new_key = hashlib.pbkdf2_hmac(
                'sha256',
                psd.encode('utf-8'),
                salt.encode('ascii'),
                100000
            )
    new_key = binascii.hexlify(new_key).decode('ascii')
    return new_key == stored_hash

# key = "password"
# key = hash_password(key)
# print(key)
# print(check_password("password", key))
# print(check_password("passwo", key))

