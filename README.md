# stream-overlay-components

## Setting up the SSL certificate for the local server

Twitch needs a https connection for the callback when it isn't calling back to localhost. For this every few years a new certificate needs to be created. The following steps are needed to create a new certificate:

1. Open a terminal
2. Navigate to a folder where you can temporarily store the created certificate
3. run `mkcert.exe 192.168.1.144 127.0.0.1 localhost ::1`
   1. Make sure to include all domains/ips you want the certificate to cover
4. Rename the created files to `cert.pem` and `key.pem`
5. Move the files to wherever your start-up batch file is located
   1. At the time of writing this documentation the location is `C:\Users\<username>\OneDrive\<personaname>\STREAM\obs\overlays\apps`

## Starting the local server for running the built overlay in OBS

1. Open a terminal
2. Navigate to the folder where the start-up batch file is located
   1. At the time of writing this documentation the location is `C:\Users\<username>\OneDrive\<personaname>\STREAM\obs\overlays\apps`
3. Run `start-obs.bat`

### Prerequisites

1. For creating the ssl certificate `mkcert` is required
2. For the local server [`serve`](https://www.npmjs.com/package/serve) is required

## OBS Websocket connection in production

As long as the stream overlay components application is running on the same machine as OBS the websocket connection can be established using `ws://127.0.0.1:4455` / `ws://localhost:4455`. It doesn't matter that the application itself is served via `https` as the mixed content policy includes an exception for localhost connections as those are generally seen as non-risky due to the fact that they are only accessible from the local machine.
