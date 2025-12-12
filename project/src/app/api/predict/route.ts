import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { initial_temp_C, time_to_50C_sec } = body;

        if (initial_temp_C === undefined || time_to_50C_sec === undefined) {
            return NextResponse.json({ error: 'Missing required parameters: initial_temp_C, time_to_50C_sec' }, { status: 400 });
        }

        const timeTo50 = parseFloat(time_to_50C_sec);
        if (isNaN(timeTo50) || timeTo50 <= 0) {
            return NextResponse.json({ error: 'Invalid time_to_50C_sec. Must be > 0.' }, { status: 400 });
        }

        const initialTemp = parseFloat(initial_temp_C);

        // Heating rate is auto-derived from temperature rise behavior. 
        // This avoids the need for direct measurement and improves simplicity.
        const calculated_heating_rate = Math.max(0.01, (50 - initialTemp) / timeTo50);

        // Locate the python executable and script
        // We assume the python_env is in the root workspace folder, which is two levels up from this project?
        // Project: c:\Users\agraw\Downloads\website (2)\website\biofit3d-web
        // Python: c:\Users\agraw\Downloads\website (2)\python_env\python\python.exe

        const projectRoot = process.cwd();
        const pythonPath = process.env.PYTHON_PATH || 'python';
        const scriptPath = path.join(projectRoot, 'backend', 'scripts', 'predict.py');

        return new Promise<NextResponse>((resolve) => {
            const pythonProcess = spawn(pythonPath, [scriptPath]);
            let dataString = '';
            let errorString = '';

            pythonProcess.stdout.on('data', (data) => {
                dataString += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorString += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python script error:', errorString);
                    resolve(NextResponse.json({ error: 'Prediction execution failed', details: errorString }, { status: 500 }));
                } else {
                    try {
                        const result = JSON.parse(dataString);
                        if (result.error) {
                            resolve(NextResponse.json({ error: result.error }, { status: 500 }));
                        } else {
                            // Append the calculated rate to the result for transparency if needed, or just return result
                            resolve(NextResponse.json({ ...result, calculated_heating_rate }, { status: 200 }));
                        }
                    } catch (e) {
                        console.error('JSON parse error:', e, dataString);
                        resolve(NextResponse.json({ error: 'Failed to parse prediction results' }, { status: 500 }));
                    }
                }
            });

            // Send input data to stdin
            pythonProcess.stdin.write(JSON.stringify({
                initial_temp_C: initialTemp,
                heating_rate_C_per_s: calculated_heating_rate,
                time_to_50C_sec: timeTo50
            }));
            pythonProcess.stdin.end();
        });

    } catch (error) {
        console.error('Prediction API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
