import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ConvoSync Backend</title>
    <style>
        body {
            background-color: #0f172a;
            color: #f8fafc;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            padding: 3rem;
            border-radius: 1rem;
            background-color: #1e293b;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            border: 1px solid #334155;
            max-width: 400px;
            width: 90%;
        }
        h1 {
            margin: 0 0 1rem 0;
            font-size: 2.5rem;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
        }
        .status-container {
            margin: 2rem 0;
        }
        .status {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1.5rem;
            background-color: rgba(34, 197, 94, 0.1);
            color: #4ade80;
            border-radius: 9999px;
            font-weight: 600;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .dot {
            width: 10px;
            height: 10px;
            background-color: #4ade80;
            border-radius: 50%;
            position: relative;
        }
        .dot::after {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border-radius: 50%;
            border: 2px solid #4ade80;
            animation: ripple 2s infinite;
            opacity: 0;
        }
        @keyframes ripple {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(2.5); opacity: 0; }
        }
        p {
            color: #94a3b8;
            margin: 0;
            line-height: 1.6;
        }
        .footer {
            margin-top: 2rem;
            font-size: 0.875rem;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ConvoSync</h1>
        <div class="status-container">
            <div class="status">
                <span class="dot"></span>
                <span>System Online</span>
            </div>
        </div>
        <p>The backend services are optimized and running smoothly. API endpoints are ready for requests.</p>
        <div class="footer">
            v1.0.0 • Secured connection
        </div>
    </div>
</body>
</html>
    `
  }
}
