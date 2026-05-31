<#
.SYNOPSIS
    Starts a simple local static file server for the Kanara Covenant website.

.DESCRIPTION
    Serves the current directory over HTTP using the built-in System.Net.HttpListener.
    This provides a reliable, zero-dependency way to preview the site on Windows/PowerShell
    (especially useful when Python's http.server or npx serve are not available).

    The Living Pulse animations and all cross-page functionality work correctly because
    this is a real HTTP server (not file:// protocol).

.EXAMPLE
    .\serve.ps1
    # Serves on http://localhost:8080 and opens the browser

.EXAMPLE
    .\serve.ps1 -Port 3000
    # Serves on a custom port
#>

[CmdletBinding()]
param(
    [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Write-Host ""
Write-Host "===============================================================" -ForegroundColor DarkYellow
Write-Host "  Kanara Covenant - Local Development Server" -ForegroundColor Yellow
Write-Host "  Living Pulse v1.0 @ 90 BPM" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "  Serving: " -NoNewline -ForegroundColor Gray
Write-Host $root -ForegroundColor White
Write-Host "  URL:     " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:$Port" -ForegroundColor Green
Write-Host ""
Write-Host "  Open " -NoNewline -ForegroundColor Gray
Write-Host "test-pulse.html" -ForegroundColor White -NoNewline
Write-Host " in multiple tabs to verify perfect sync." -ForegroundColor Gray
Write-Host ""
Write-Host "  Press " -NoNewline -ForegroundColor Gray
Write-Host "Ctrl+C" -ForegroundColor Red -NoNewline
Write-Host " to stop the server." -ForegroundColor Gray
Write-Host ""

# MIME type map (sufficient for this vanilla static site)
$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.mjs'  = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.svg'  = 'image/svg+xml'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
    '.txt'  = 'text/plain; charset=utf-8'
    '.md'   = 'text/markdown; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Server started. Listening on $prefix" -ForegroundColor Green
    Write-Host ""

    # Auto-open the browser to the index (or test page for quick verification)
    $startUrl = "http://localhost:$Port/index.html"
    Write-Host "Opening browser → $startUrl" -ForegroundColor Cyan
    Start-Process $startUrl | Out-Null

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawUrl)) { $rawUrl = 'index.html' }

        $filePath = Join-Path $root $rawUrl

        # Basic security: prevent path traversal
        $fullRoot = [System.IO.Path]::GetFullPath($root)
        $fullPath = [System.IO.Path]::GetFullPath($filePath)
        if (-not $fullPath.StartsWith($fullRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.StatusDescription = "Forbidden"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("403 - Forbidden")
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = 'application/octet-stream' }

            $response.ContentType = $contentType
            $response.StatusCode = 200

            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $response.StatusDescription = "Internal Server Error"
            }
        } else {
            $response.StatusCode = 404
            $response.StatusDescription = "Not Found"
            $notFound = "404 - Not Found: /$rawUrl"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }

        $response.Close()
    }
} catch [System.Net.HttpListenerException] {
    if ($_.Exception.ErrorCode -eq 5) {  # Access denied (port < 1024 or permissions)
        Write-Host "ERROR: Access denied. Try running as Administrator or use a port >= 1024." -ForegroundColor Red
    } else {
        Write-Host "Server error: $($_.Exception.Message)" -ForegroundColor Red
    }
} catch {
    Write-Host "Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Yellow
} 