import socket



localIP = "10.242.1.99"

localPort = 42

bufferSize = 1024


# Create a datagram socket

UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)


# Bind to address and ip

UDPServerSocket.bind((localIP, localPort))


print("UDP server up and listening")


# Listen for incoming datagrams
address =""
while(True):
    try:
        UDPServerSocket.settimeout(2)
        bytesAddressPair = UDPServerSocket.recvfrom(bufferSize)

        message = bytesAddressPair[0]

        address = bytesAddressPair[1]

        clientMsg = "Message from Client:{}".format(message)
        clientIP = "Client IP Address:{}".format(address)

        print(clientMsg)
        print(clientIP)

        # Sending a reply to client

        msgFromServer = input('Press Enter for getInfo command')
        if not msgFromServer:
            bytesToSend = b'\xaa\x06\x00\x00\xc1\xfd'
        else:
            bytesToSend = str.encode(msgFromServer)
        UDPServerSocket.sendto(bytesToSend, address)
    except socket.timeout:
        while True:
            msgFromServer = input('ُSocket is established!')
            if not msgFromServer:
                bytesToSend = b'\xaa\x06\x00\x00\xc1\xfd'
            else:
                bytesToSend = str.encode(msgFromServer)
            UDPServerSocket.sendto(bytesToSend, address)


    except KeyboardInterrupt:
        print("Keyboard Interrupt")
        exit()
