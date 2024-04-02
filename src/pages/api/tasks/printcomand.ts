// Arquivo: pages/api/runPythonScript.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PythonShell } from 'python-shell';




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("ate aqui tudo certo 1")
    const texto = JSON.stringify(req.body)
    let options = {
        args: [texto],

  pythonOptions: ['-u'], // get print results in real-time
    };

    PythonShell.run('/Users/paulo/Desktop/projeto/my-lab/src/pages/api/tasks/print.py', options).then(messages => {
        // results is an array consisting of messages collected during execution
        console.log('results: deu certo ate aqui');
    });

    res.status(200).json({ status: 'Script executado' });
}
