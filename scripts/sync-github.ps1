# GitHub 동기화 스크립트 (Windows PowerShell)
# 사용법: .\scripts\sync-github.ps1
# 또는: .\scripts\sync-github.ps1 -RepoUrl "https://github.com/kyungalee1/Friends.git"

param(
    [string]$RepoUrl = "https://github.com/kyungalee1/Friends.git",
    [string]$Branch = "main",
    [string]$Message = "Update: study race app"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

Write-Host "📁 프로젝트: $ProjectRoot" -ForegroundColor Cyan

# git 설치 확인
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git이 설치되어 있지 않습니다. https://git-scm.com 에서 설치해주세요." -ForegroundColor Red
    exit 1
}

# 저장소 초기화
if (-not (Test-Path ".git")) {
    Write-Host "🔧 git init..." -ForegroundColor Yellow
    git init
    git branch -M $Branch
}

# remote URL 수정 (오타 방지)
$currentUrl = (git remote get-url origin 2>$null)
if (-not $currentUrl) {
    Write-Host "🔗 remote origin 추가: $RepoUrl" -ForegroundColor Yellow
    git remote add origin $RepoUrl
} elseif ($currentUrl -ne $RepoUrl) {
    Write-Host "🔗 remote URL 수정: $currentUrl -> $RepoUrl" -ForegroundColor Yellow
    git remote set-url origin $RepoUrl
}

# 브랜치 이름 통일
$currentBranch = git branch --show-current 2>$null
if ($currentBranch -ne $Branch) {
    git branch -M $Branch 2>$null
}

# 커밋할 변경사항
git add -A
$status = git status --porcelain
if ($status) {
    Write-Host "📦 변경사항 커밋 중..." -ForegroundColor Yellow
    git commit -m $Message
} else {
    Write-Host "✓ 커밋할 변경 없음" -ForegroundColor Green
}

# 원격 상태 확인
git fetch origin 2>&1 | Out-Null
$remoteExists = git ls-remote --heads origin $Branch 2>$null

if (-not $remoteExists) {
    Write-Host "🚀 원격이 비어 있음 → push..." -ForegroundColor Yellow
    git push -u origin $Branch
} else {
  # 로컬이 원격보다 앞서 있거나 같으면 push
  $localRev = git rev-parse $Branch 2>$null
  $remoteRev = git rev-parse "origin/$Branch" 2>$null

  if ($LASTEXITCODE -ne 0 -or -not $remoteRev) {
    git push -u origin $Branch
  } else {
    $mergeBase = git merge-base $Branch "origin/$Branch" 2>$null
    if ($localRev -eq $remoteRev) {
      Write-Host "✓ 이미 GitHub와 동기화됨" -ForegroundColor Green
    } elseif ($mergeBase -eq $remoteRev) {
      Write-Host "🚀 push..." -ForegroundColor Yellow
      git push origin $Branch
    } elseif ($mergeBase -eq $localRev) {
      Write-Host "⬇️  pull 후 push..." -ForegroundColor Yellow
      git pull origin $Branch --rebase
      git push origin $Branch
    } else {
      Write-Host "⚠️  히스토리가 갈라짐 → rebase 시도..." -ForegroundColor Yellow
      git pull origin $Branch --rebase --autostash 2>$null
      if ($LASTEXITCODE -ne 0) {
        Write-Host "   rebase 실패 → merge로 시도..." -ForegroundColor Yellow
        git rebase --abort 2>$null
        git pull origin $Branch --no-rebase
      }
      git push origin $Branch
    }
  }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ GitHub 동기화 완료!" -ForegroundColor Green
    Write-Host "   $RepoUrl" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ push 실패. GitHub 로그인(PAT)이 필요할 수 있습니다." -ForegroundColor Red
    Write-Host "   GitHub Desktop 사용 또는 Personal Access Token으로 인증해주세요." -ForegroundColor Yellow
    exit 1
}
