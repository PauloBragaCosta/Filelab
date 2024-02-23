import { NextApiRequest} from 'next';
import { SerialPort } from 'serialport';

const print = async (req: NextApiRequest) => {
  if (req.method === 'POST') {
    // Criação da porta serial com configuração correta
    const port = new SerialPort({ path: 'COM9', baudRate: 9600 });
    // Imprime uma mensagem na porta serial
    port.write('olá mundo\n');
    port.write('\n');
    port.write('\n');
    port.write('\n');
};
}

export default print;