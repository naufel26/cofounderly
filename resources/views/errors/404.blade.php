<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Not Found | Cofounderly</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .card {
            background: #fff;
            border-radius: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 0 0 1px rgba(226,232,240,.8);
            padding: 3rem 2.5rem;
            max-width: 440px;
            width: 100%;
            text-align: center;
        }
        .code {
            font-size: 5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #2DAB94, #F1B981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 0.5rem;
        }
        h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
        p { color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #2DAB94;
            color: #fff;
            font-weight: 700;
            font-size: 0.9rem;
            padding: 0.65rem 1.5rem;
            border-radius: 0.75rem;
            text-decoration: none;
            transition: background 0.15s;
        }
        .btn:hover { background: #249e89; }
        .logo { font-size: 1.1rem; font-weight: 800; color: #2DAB94; margin-bottom: 2rem; letter-spacing: -0.02em; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">Cofounderly</div>
        <div class="code">404</div>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <a href="/" class="btn">← Back to Home</a>
    </div>
</body>
</html>
