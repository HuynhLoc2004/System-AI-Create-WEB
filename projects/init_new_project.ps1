param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

$SourcePath = Join-Path $PSScriptRoot "_project_template"
$DestinationPath = Join-Path $PSScriptRoot $ProjectName

if (Test-Path $DestinationPath) {
    Write-Error "Dự án '$ProjectName' đã tồn tại trong thư mục projects! Vui lòng chọn tên khác."
    exit 1
}

Write-Host "🚀 Đang khởi tạo không gian dự án mới: '$ProjectName' từ khuôn mẫu chuẩn..." -ForegroundColor Cyan

Copy-Item -Path $SourcePath -Destination $DestinationPath -Recurse -Force

# Đổi tên trong file tổng quan dự án
$OverviewFile = Join-Path $DestinationPath "docs\project_overview.md"
if (Test-Path $OverviewFile) {
    (Get-Content $OverviewFile) -replace "\[Điền tên dự án thực tế\]", $ProjectName | Set-Content $OverviewFile
}

Write-Host "✅ KHỞI TẠO DỰ ÁN THÀNH CÔNG!" -ForegroundColor Green
Write-Host "📁 Thư mục dự án: $DestinationPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Trình tự 9 phòng ban tiếp quản dự án này:" -ForegroundColor White
Write-Host "  1. PM & BA cập nhật tài liệu yêu cầu tại: $ProjectName/docs/"
Write-Host "  2. DevOps cấu hình biến môi trường tại: $ProjectName/config/local.env và production.env"
Write-Host "  3. Database team viết migration tại: $ProjectName/src/database/migrations/"
Write-Host "  4. Backend team lập trình API tại: $ProjectName/src/backend/"
Write-Host "  5. Frontend team lập trình giao diện tại: $ProjectName/src/frontend/"
Write-Host "  6. QA team kiểm thử tại: $ProjectName/docs/qa_test_reports.md"

