# GitHub sync script (Windows PowerShell)
# Usage: .\scripts\sync-github.ps1

param(
    [string]$RepoUrl = 'https://github.com/kyungalee1/Friends.git',
    [string]$Branch = 'main',
    [string]$Message = 'Update: study race app'
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

Write-Host "[*] Project: $ProjectRoot" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host '[X] Git is not installed. Get it from https://git-scm.com' -ForegroundColor Red
    exit 1
}

if (-not (Test-Path '.git')) {
    Write-Host '[*] git init...' -ForegroundColor Yellow
    git init
    git branch -M $Branch
}

$currentUrl = (git remote get-url origin 2>$null)
if (-not $currentUrl) {
    Write-Host "[*] Adding remote origin: $RepoUrl" -ForegroundColor Yellow
    git remote add origin $RepoUrl
} elseif ($currentUrl -ne $RepoUrl) {
    Write-Host "[*] Fixing remote URL: $currentUrl -> $RepoUrl" -ForegroundColor Yellow
    git remote set-url origin $RepoUrl
}

$currentBranch = git branch --show-current 2>$null
if ($currentBranch -ne $Branch) {
    git branch -M $Branch 2>$null
}

git add -A
$status = git status --porcelain
if ($status) {
    Write-Host '[*] Committing changes...' -ForegroundColor Yellow
    git commit -m $Message
} else {
    Write-Host '[OK] Nothing to commit' -ForegroundColor Green
}

git fetch origin 2>&1 | Out-Null
$remoteExists = git ls-remote --heads origin $Branch 2>$null

if (-not $remoteExists) {
    Write-Host '[*] Remote empty - pushing...' -ForegroundColor Yellow
    git push -u origin $Branch
} else {
    $localRev = git rev-parse $Branch 2>$null
    $remoteRev = git rev-parse "origin/$Branch" 2>$null

    if ($LASTEXITCODE -ne 0 -or -not $remoteRev) {
        git push -u origin $Branch
    } else {
        $mergeBase = git merge-base $Branch "origin/$Branch" 2>$null
        if ($localRev -eq $remoteRev) {
            Write-Host '[OK] Already synced with GitHub' -ForegroundColor Green
        } elseif ($mergeBase -eq $remoteRev) {
            Write-Host '[*] Pushing...' -ForegroundColor Yellow
            git push origin $Branch
        } elseif ($mergeBase -eq $localRev) {
            Write-Host '[*] Pull then push...' -ForegroundColor Yellow
            git pull origin $Branch --rebase
            git push origin $Branch
        } else {
            Write-Host '[*] Diverged history - rebase...' -ForegroundColor Yellow
            git pull origin $Branch --rebase --autostash 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Host '[*] Rebase failed - trying merge...' -ForegroundColor Yellow
                git rebase --abort 2>$null
                git pull origin $Branch --no-rebase
            }
            git push origin $Branch
        }
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ''
    Write-Host '[OK] GitHub sync complete!' -ForegroundColor Green
    Write-Host "    $RepoUrl" -ForegroundColor Cyan
} else {
    Write-Host ''
    Write-Host '[X] Push failed. You may need GitHub login (PAT or GitHub Desktop).' -ForegroundColor Red
    exit 1
}
