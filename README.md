> [!IMPORTANT]
> This project is still in development and is currently undergoing a whole recode.

# Rosh
Rosh is an open-source Anticheat designed for Minecraft Bedrock Edition Dedicated Servers (BDS) that makes use of its in-build Scripting API.
It is currently in version 1.25 [Dev] and supports 1.21.44 (Previews excluded).

### Notes
- Found any bugs, false flags, bypasses or want to suggest certain features? Be sure to check out Rosh's official discord server!
  https://discord.gg/FNrJDvG95r
- Feel free to take inspiration for learning purposes! <3
- Altough this project is open-source, please avoid copying certain features and claiming them as your own.

### Setup
- It is required to edit the ```server.properties``` config file in your BDS folder and add the following line :
```properties
op-permission-level=2 #minimum=2, maximum=4
```
- If you would like to enable Webhooks you must run Rosh on a Bedrock Dedicated Server and add the following to `config/default/permissions.json` :
```json
{
  "allowed_modules": [
    "@minecraft/server-net"
  ]
}
```
- Here's a link to the official Bedrock Dedicated Server Software:
  https://www.minecraft.net/en-us/download/server/bedrock
- While Realms and local worlds would technically work it is advised to not use Rosh there as some functionalities such as cool Webhooks or Packet based checks would not work :(
