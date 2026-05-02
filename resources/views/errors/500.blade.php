<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Server Error | Cofounderly</title>
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
            background: linear-gradient(135deg, #ef4444, #f97316);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 0.5rem;
        }
        h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
        p { color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }
        .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
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
        .btn-outline {
            background: transparent;
            border: 1.5px solid #e2e8f0;
            color: #475569;
        }
        .btn-outline:hover { background: #f8fafc; }
        .logo { font-size: 1.1rem; font-weight: 800; color: #2DAB94; margin-bottom: 2rem; letter-spacing: -0.02em; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">Cofounderly</div>
        <div class="code">500</div>
        <h1>Something went wrong</h1>
        <p>We hit an unexpected error. Our team has been notified. Please try again in a moment.</p>
        <div class="actions">
            <a href="/" class="btn">← Back to Home</a>
            <a href="javascript:location.reload()" class="btn btn-outline">Try again</a>
        </div>
    </div>
</body>
</html>
