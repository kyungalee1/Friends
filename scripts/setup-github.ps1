# GitHub first-time setup
# Usage: .\scripts\setup-github.ps1

param(
    [string]$RepoUrl = 'https://github.com/kyungalee1/Friends.git'
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

Write-Host '=== Study Race - GitHub Setup ===' -ForegroundColor Cyan
Write-Host ''

$email = git config user.email 2>$null
$name = git config user.name 2>$null
if (-not $email) {
    $inputEmail = Read-Host 'Git email (GitHub account email)'
    git config user.email $inputEmail
}
if (-not $name) {
    $inputName = Read-Host 'Git name (e.g. Kyung)'
    git config user.name $inputName
}

& "$ProjectRoot\scripts\sync-github.ps1" -RepoUrl $RepoUrl -Message 'Initial commit: study race app'

Write-Host ''
Write-Host 'Next steps:' -ForegroundColor Cyan
Write-Host '  1. Check files at https://github.com/kyungalee1/Friends'
Write-Host '  2. Vercel - Import - Friends repo - main branch'
Write-Host '  3. Vercel env vars - DATABASE_URL, JWT_SECRET'
Write-Host ''
Write-Host 'After code changes, run:' -ForegroundColor Cyan
Write-Host '  npm run github:sync'
