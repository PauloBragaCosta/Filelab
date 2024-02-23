import { render, Printer, Text } from 'react-thermal-printer';
import { SerialPort } from 'serialport/dist/serialport';
import { WritableStreamDefaultWriter } from 'web-streams-polyfill/ponyfill/es2018';

async function printText() {
  const data: string = await render(
    <Printer type="epson">
      <Text>Hello World</Text>
    </Printer>
  );

  const port: SerialPort = await window.navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });

  const writer: WritableStreamDefaultWriter<Uint8Array> | undefined = port.writable?.getWriter();
  if (writer != null) {
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(data));
    writer.releaseLock();
  }
}

printText();
