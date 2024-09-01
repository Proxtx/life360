# life360

life-360-display v2

# public/private key singing

use the following commands for the singing feature

```
openssl genpkey -algorithm RSA -out private-key.pem
openssl rsa -pubout -in private-key.pem -out public-key.pem
```
