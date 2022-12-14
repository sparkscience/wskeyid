# WebSocket auth example

Using public-key cryptography to support authenticated connection.

## Specification

Client:

1. Connect to server, while also providing the client ID (which will double as the public key), via either the default `client_id` query parameter, or another query parameter that has been agreed-upon ahead of time. The public key must match a specific format (currently only `WebCrypto-raw.EC.P-256` is supported, but more will come, such as P-384, P-512, secp256k1, ed25519, etc.)
2. Listen for `CHALLENGE` messages which will contain a `payload` field
3. Respond with a `CHALLENGE_RESPONSE` containing the original payload (`payload`), and a base64-encoded byte buffer, representing the signature, `signature`. Optionally, the signature can be prefixed with `<signature scheme>`, if the signature scheme has more than one possible representation (although, currently, ECDSA emits signatures that are just byte buffer concatenation of the r and s components)
4. If the challenge response matches, then send a `CONNECTED` message, and the handshake is now considered complete
	- Otherwise, if the signature does not match, then close the connection

## Diagrams

![Sequence diagram](/sequence-diagram.png)
![Flowchart](/flowchart.png)