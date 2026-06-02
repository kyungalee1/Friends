# 최초 1회 GitHub 연결 설정
# 사용법: .\scripts\setup-github.ps1

param(
    [string]$RepoUrl = "https://github.com/kyungalee1/Friends.git"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

Write-Host "=== 공부 레이스 - GitHub 최초 설정 ===" -ForegroundColor Cyan
Write-Host ""

# 사용자 정보 (없을 때만)
$email = git config user.email 2>$null
$name = git config user.name 2>$null
if (-not $email) {
    $inputEmail = Read-Host "Git 이메일 (GitHub 가입 이메일)"
    git config user.email $inputEmail
}
if (-not $name) {
    $inputName = Read-Host "Git 이름 (예: Kyung)"
    git config user.name $inputName
}

# 동기화 실행
& "$ProjectRoot\scripts\sync-github.ps1" -RepoUrl $RepoUrl -Message "Initial commit: study race app"

Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "  1. https://github.com/kyungalee1/Friends 에 파일이 보이는지 확인"
Write-Host "  2. Vercel → Import → Friends 저장소 → main 브랜치"
Write-Host "  3. Vercel Environment Variables: DATABASE_URL, JWT_SECRET"
Write-Host ""
Write-Host "이후 코드 수정 후 업로드:" -ForegroundColor Cyan
Write-Host "  npm run github:sync"
