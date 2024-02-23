import serial

import sys
import json

print("teste 1")

def print_to_serial_port():
    # Criação da porta serial com configuração correta
    port = serial.Serial('COM9', 9600)

    # Codifica a mensagem em UTF-8 antes de escrevê-la na porta serial
    message = 'Paulo Braga\n\n\n\n'
    port.write(message.encode('utf-8'))

    # Fecha a porta serial
    port.close()

print_to_serial_port()
print('teste 2')
